-- Script para agregar opciones E, F, G a todas las preguntas
-- Opciones adicionales: Solo A y B, Solo C y D, Todas las anteriores

USE examen_contabilidad;

-- Agregar opción E: "Solo A y B" a todas las preguntas
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion)
SELECT 
    id as pregunta_id,
    'E' as letra_opcion,
    'Solo A y B' as texto_opcion
FROM preguntas
WHERE NOT EXISTS (
    SELECT 1 FROM opciones 
    WHERE opciones.pregunta_id = preguntas.id 
    AND opciones.letra_opcion = 'E'
);

-- Agregar opción F: "Solo C y D" a todas las preguntas
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion)
SELECT 
    id as pregunta_id,
    'F' as letra_opcion,
    'Solo C y D' as texto_opcion
FROM preguntas
WHERE NOT EXISTS (
    SELECT 1 FROM opciones 
    WHERE opciones.pregunta_id = preguntas.id 
    AND opciones.letra_opcion = 'F'
);

-- Agregar opción G: "Todas las anteriores" a todas las preguntas
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion)
SELECT 
    id as pregunta_id,
    'G' as letra_opcion,
    'Todas las anteriores' as texto_opcion
FROM preguntas
WHERE NOT EXISTS (
    SELECT 1 FROM opciones 
    WHERE opciones.pregunta_id = preguntas.id 
    AND opciones.letra_opcion = 'G'
);

-- Verificar el resultado
SELECT 
    p.id as pregunta_id,
    p.numero_pregunta,
    COUNT(o.id) as total_opciones,
    GROUP_CONCAT(o.letra_opcion ORDER BY o.letra_opcion) as opciones_disponibles
FROM preguntas p
LEFT JOIN opciones o ON p.id = o.pregunta_id
GROUP BY p.id, p.numero_pregunta
ORDER BY p.numero_pregunta;

-- Mensaje de confirmación
SELECT 
    COUNT(DISTINCT pregunta_id) as total_preguntas,
    COUNT(*) as total_opciones,
    COUNT(*) / COUNT(DISTINCT pregunta_id) as opciones_por_pregunta
FROM opciones;
