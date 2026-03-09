<?php
/**
 * Modelo Resultado - Maneja resultados y calificaciones
 */
require_once __DIR__ . '/../core/Database.php';

class Resultado {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Obtener calificación según porcentaje
     */
    public function obtenerCalificacion($porcentaje, $examenId = 1) {
        $stmt = $this->db->prepare("
            SELECT calificacion, descripcion 
            FROM rangos_calificacion 
            WHERE examen_id = ? AND ? >= rango_min AND ? <= rango_max
            LIMIT 1
        ");
        $stmt->execute([$examenId, $porcentaje, $porcentaje]);
        return $stmt->fetch();
    }
    
    /**
     * Buscar resultado existente
     */
    public function buscarPorIntento($intentoId) {
        $stmt = $this->db->prepare("SELECT id FROM resultados WHERE intento_id = ?");
        $stmt->execute([$intentoId]);
        return $stmt->fetch();
    }
    
    /**
     * Crear nuevo resultado
     */
    public function crear($intentoId, $totalPreguntas, $correctas, $incorrectas, $porcentaje) {
        $stmt = $this->db->prepare("
            INSERT INTO resultados (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje) 
            VALUES (?, ?, ?, ?, ?)
        ");
        return $stmt->execute([$intentoId, $totalPreguntas, $correctas, $incorrectas, $porcentaje]);
    }
    
    /**
     * Actualizar resultado existente
     */
    public function actualizar($intentoId, $totalPreguntas, $correctas, $incorrectas, $porcentaje) {
        $stmt = $this->db->prepare("
            UPDATE resultados 
            SET total_preguntas = ?, respuestas_correctas = ?, respuestas_incorrectas = ?, porcentaje = ? 
            WHERE intento_id = ?
        ");
        return $stmt->execute([$totalPreguntas, $correctas, $incorrectas, $porcentaje, $intentoId]);
    }
    
    /**
     * Guardar o actualizar resultado
     */
    public function guardar($intentoId, $totalPreguntas, $correctas, $incorrectas, $porcentaje) {
        $resultadoExistente = $this->buscarPorIntento($intentoId);
        
        if ($resultadoExistente) {
            return $this->actualizar($intentoId, $totalPreguntas, $correctas, $incorrectas, $porcentaje);
        }
        
        return $this->crear($intentoId, $totalPreguntas, $correctas, $incorrectas, $porcentaje);
    }
}
