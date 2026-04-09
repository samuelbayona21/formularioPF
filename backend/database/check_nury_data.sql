-- ============================================
-- VERIFICAR DATOS DE NURY MARTINEZ
-- ============================================
-- Ejecuta estas consultas para ver los datos existentes

-- 1. Buscar usuario Nury
SELECT 'USUARIO NURY:' as info;
SELECT id, nombre_completo, cedula, tipo_usuario, fecha_registro 
FROM usuarios 
WHERE nombre_completo LIKE '%Nury%' OR cedula = '51891837';

-- 2. Ver todos los intentos de examen
SELECT 'INTENTOS DE EXAMEN:' as info;
SELECT ie.id, ie.usuario_id, u.nombre_completo, ie.estado, ie.fecha_inicio, ie.fecha_fin
FROM intentos_examen ie
JOIN usuarios u ON ie.usuario_id = u.id
WHERE u.nombre_completo LIKE '%Nury%' OR u.cedula = '51891837';

-- 3. Ver resultados existentes
SELECT 'RESULTADOS:' as info;
SELECT r.id, r.intento_id, r.total_preguntas, r.respuestas_correctas, r.porcentaje, r.fecha_calculo
FROM resultados r
JOIN intentos_examen ie ON r.intento_id = ie.id
JOIN usuarios u ON ie.usuario_id = u.id
WHERE u.nombre_completo LIKE '%Nury%' OR u.cedula = '51891837';

-- 4. Contar respuestas por intento
SELECT 'RESPUESTAS POR INTENTO:' as info;
SELECT re.intento_id, COUNT(*) as total_respuestas, 
       SUM(CASE WHEN re.es_correcta = 1 THEN 1 ELSE 0 END) as correctas,
       SUM(CASE WHEN re.es_correcta = 0 THEN 1 ELSE 0 END) as incorrectas
FROM respuestas_estudiante re
JOIN intentos_examen ie ON re.intento_id = ie.id
JOIN usuarios u ON ie.usuario_id = u.id
WHERE u.nombre_completo LIKE '%Nury%' OR u.cedula = '51891837'
GROUP BY re.intento_id;

-- 5. Ver estructura de IDs disponibles
SELECT 'IDS DISPONIBLES:' as info;
SELECT 
    (SELECT MAX(id) FROM usuarios) as max_usuario_id,
    (SELECT MAX(id) FROM intentos_examen) as max_intento_id,
    (SELECT MAX(id) FROM resultados) as max_resultado_id,
    (SELECT MAX(id) FROM respuestas_estudiante) as max_respuesta_id;