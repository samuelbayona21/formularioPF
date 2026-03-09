<?php
/**
 * SCRIPT AUTOMÁTICO PARA PROCESAR LOS 3 CSV
 * Ejecutar desde: http://localhost/examen_contabilidad/procesar_csv_automatico.php
 */

header('Content-Type: text/html; charset=utf-8');
require_once 'config/database.php';

echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Procesando CSV</title>
    <style>
        body { font-family: sans-serif; background: #020617; color: #e5e7eb; padding: 20px; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
        .info { color: #38bdf8; }
        .container { max-width: 800px; margin: 0 auto; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 10px; }
        h1 { color: #38bdf8; }
        pre { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
<div class='container'>
<h1>🚀 Procesamiento Automático de CSV</h1>";

try {
    $db = Database::getInstance()->getConnection();
    
    // Limpiar datos existentes
    echo "<h2 class='info'>Paso 1: Limpiando datos existentes...</h2>";
    $db->exec("DELETE FROM respuestas_estudiante");
    $db->exec("DELETE FROM resultados");
    $db->exec("DELETE FROM intentos_examen");
    $db->exec("DELETE FROM opciones");
    $db->exec("DELETE FROM preguntas");
    $db->exec("DELETE FROM rangos_calificacion");
    echo "<p class='success'>✓ Datos limpiados</p>";
    
    // Crear tabla de rangos si no existe
    $db->exec("
        CREATE TABLE IF NOT EXISTS rangos_calificacion (
            id INT AUTO_INCREMENT PRIMARY KEY,
            examen_id INT NOT NULL,
            rango_min DECIMAL(5,2) NOT NULL,
            rango_max DECIMAL(5,2) NOT NULL,
            calificacion VARCHAR(50) NOT NULL,
            descripcion TEXT,
            FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    
    // Insertar rangos de calificación por defecto
    echo "<h2 class='info'>Paso 2: Configurando rangos de calificación...</h2>";
    $stmt = $db->prepare("
        INSERT INTO rangos_calificacion (examen_id, rango_min, rango_max, calificacion, descripcion) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $rangos = [
        [1, 0, 40, 'Deficiente', 'Necesita mejorar significativamente'],
        [1, 40, 60, 'Insuficiente', 'Requiere más estudio'],
        [1, 60, 70, 'Aceptable', 'Aprobado nivel básico'],
        [1, 70, 85, 'Bueno', 'Buen dominio del tema'],
        [1, 85, 100, 'Excelente', 'Dominio sobresaliente']
    ];
    
    foreach ($rangos as $rango) {
        $stmt->execute($rango);
    }
    echo "<p class='success'>✓ 5 rangos de calificación configurados</p>";
    
    // Procesar archivo de RESPUESTAS
    echo "<h2 class='info'>Paso 3: Procesando Respuestas_Correctas.csv...</h2>";
    $archivoRespuestas = 'csv/Respuestas_Correctas.csv';
    $respuestasCorrectas = [];
    
    if (!file_exists($archivoRespuestas)) {
        throw new Exception("No se encontró: $archivoRespuestas");
    }
    
    $handle = fopen($archivoRespuestas, 'r');
    $contenido = file_get_contents($archivoRespuestas);
    $contenido = mb_convert_encoding($contenido, 'UTF-8', mb_detect_encoding($contenido, 'UTF-8, ISO-8859-1', true));
    file_put_contents($archivoRespuestas, $contenido);
    $handle = fopen($archivoRespuestas, 'r');
    
    fgetcsv($handle, 0, ';'); // Saltar encabezado
    
    while (($datos = fgetcsv($handle, 0, ';')) !== false) {
        if (count($datos) >= 2 && !empty(trim($datos[0]))) {
            $numero = trim($datos[0]);
            $respuesta = strtoupper(trim($datos[1]));
            $respuestasCorrectas[$numero] = $respuesta;
        }
    }
    fclose($handle);
    
    echo "<p class='success'>✓ " . count($respuestasCorrectas) . " respuestas correctas cargadas</p>";
    
    // Procesar archivo de PREGUNTAS
    echo "<h2 class='info'>Paso 4: Procesando Examen_Contadores_Banco_Respuestas_Calificacion.csv...</h2>";
    $archivoPreguntas = 'csv/Examen_Contadores_Banco_Respuestas_Calificacion (1).csv';
    
    if (!file_exists($archivoPreguntas)) {
        throw new Exception("No se encontró: $archivoPreguntas");
    }
    
    $handle = fopen($archivoPreguntas, 'r');
    $contenido = file_get_contents($archivoPreguntas);
    $contenido = mb_convert_encoding($contenido, 'UTF-8', mb_detect_encoding($contenido, 'UTF-8, ISO-8859-1', true));
    file_put_contents($archivoPreguntas, $contenido);
    $handle = fopen($archivoPreguntas, 'r');
    
    fgetcsv($handle, 0, ';'); // Saltar encabezado
    
    $preguntasCargadas = 0;
    $opcionesCargadas = 0;
    
    while (($datos = fgetcsv($handle, 0, ';')) !== false) {
        if (count($datos) < 3 || empty(trim($datos[0]))) continue;
        
        $numero = trim($datos[0]);
        $enunciado = trim($datos[1]);
        
        if (!isset($respuestasCorrectas[$numero])) {
            echo "<p class='error'>⚠ Pregunta $numero sin respuesta correcta</p>";
            continue;
        }
        
        $respuestaCorrecta = $respuestasCorrectas[$numero];
        
        // Insertar pregunta
        $stmt = $db->prepare("
            INSERT INTO preguntas (examen_id, numero_pregunta, texto_pregunta, respuesta_correcta) 
            VALUES (1, ?, ?, ?)
        ");
        $stmt->execute([$numero, $enunciado, $respuestaCorrecta]);
        $preguntaId = $db->lastInsertId();
        $preguntasCargadas++;
        
        // Insertar opciones
        $letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        for ($i = 2; $i < count($datos) && $i < 10; $i++) {
            $textoOpcion = trim($datos[$i]);
            if (!empty($textoOpcion)) {
                $letra = $letras[$i - 2];
                
                $stmt = $db->prepare("
                    INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) 
                    VALUES (?, ?, ?)
                ");
                $stmt->execute([$preguntaId, $letra, $textoOpcion]);
                $opcionesCargadas++;
            }
        }
    }
    fclose($handle);
    
    echo "<p class='success'>✓ $preguntasCargadas preguntas cargadas</p>";
    echo "<p class='success'>✓ $opcionesCargadas opciones cargadas</p>";
    
    // Actualizar total de preguntas
    $stmt = $db->prepare("UPDATE examenes SET total_preguntas = ? WHERE id = 1");
    $stmt->execute([$preguntasCargadas]);
    
    // Resumen final
    echo "<h2 class='success'>✅ PROCESO COMPLETADO</h2>";
    echo "<pre>";
    echo "Total de preguntas: $preguntasCargadas\n";
    echo "Total de opciones: $opcionesCargadas\n";
    echo "Rangos de calificación: 5\n";
    echo "</pre>";
    
    echo "<h3>🎯 Próximos pasos:</h3>";
    echo "<ol>";
    echo "<li><a href='index.html' style='color: #38bdf8;'>Ir al Login de Estudiantes</a></li>";
    echo "<li><a href='views/admin/dashboard.html' style='color: #38bdf8;'>Ir al Dashboard de Admin</a></li>";
    echo "</ol>";
    
} catch (Exception $e) {
    echo "<h2 class='error'>❌ ERROR</h2>";
    echo "<p class='error'>" . $e->getMessage() . "</p>";
}

echo "</div></body></html>";
