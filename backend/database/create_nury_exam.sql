-- ============================================
-- CREAR EXAMEN COMPLETO PARA NURY MARTINEZ
-- ============================================
-- Este script crea intento, respuestas y resultado para el usuario existente
-- Asume que el usuario ya existe, solo falta el examen
-- ============================================

-- Insertar intento de examen (usar el ID del usuario existente)
-- NOTA: Cambiar el usuario_id por el ID real de Nury en tu BD
INSERT INTO intentos_examen (usuario_id, examen_id, fecha_inicio, fecha_fin, tiempo_segundos, estado) 
VALUES (20, 1, '2026-03-09 14:32:25', '2026-03-09 14:53:36', 1271, 'finalizado');

-- Obtener el ID del intento recién creado (será el último insertado)
SET @intento_id = LAST_INSERT_ID();

-- Insertar las 50 respuestas usando el ID del intento
INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta, fecha_respuesta) VALUES
(@intento_id, 1, 'G', 0, '2026-03-09 14:33:20'),
(@intento_id, 2, 'G', 0, '2026-03-09 14:33:55'),
(@intento_id, 3, 'G', 0, '2026-03-09 14:34:54'),
(@intento_id, 4, 'E', 0, '2026-03-09 14:35:48'),
(@intento_id, 5, 'G', 0, '2026-03-09 14:36:47'),
(@intento_id, 6, 'F', 0, '2026-03-09 14:37:52'),
(@intento_id, 7, 'E', 0, '2026-03-09 14:38:52'),
(@intento_id, 8, 'B', 1, '2026-03-09 14:39:21'),
(@intento_id, 9, 'B', 1, '2026-03-09 14:39:40'),
(@intento_id, 10, 'C', 1, '2026-03-09 14:39:55'),
(@intento_id, 11, 'B', 1, '2026-03-09 14:40:12'),
(@intento_id, 12, 'B', 1, '2026-03-09 14:40:25'),
(@intento_id, 13, 'B', 1, '2026-03-09 14:40:46'),
(@intento_id, 14, 'B', 1, '2026-03-09 14:41:07'),
(@intento_id, 15, 'B', 1, '2026-03-09 14:41:19'),
(@intento_id, 16, 'E', 0, '2026-03-09 14:41:40'),
(@intento_id, 17, 'B', 1, '2026-03-09 14:42:06'),
(@intento_id, 18, 'B', 1, '2026-03-09 14:42:41'),
(@intento_id, 19, 'C', 1, '2026-03-09 14:43:51'),
(@intento_id, 20, 'B', 1, '2026-03-09 14:44:13'),
(@intento_id, 21, 'D', 0, '2026-03-09 14:44:43'),
(@intento_id, 22, 'B', 1, '2026-03-09 14:44:56'),
(@intento_id, 23, 'A', 0, '2026-03-09 14:45:23'),
(@intento_id, 24, 'C', 0, '2026-03-09 14:45:43'),
(@intento_id, 25, 'H', 0, '2026-03-09 14:46:19'),
(@intento_id, 26, 'B', 1, '2026-03-09 14:46:35'),
(@intento_id, 27, 'B', 1, '2026-03-09 14:46:46'),
(@intento_id, 28, 'C', 1, '2026-03-09 14:47:00'),
(@intento_id, 29, 'C', 1, '2026-03-09 14:47:13'),
(@intento_id, 30, 'B', 1, '2026-03-09 14:47:28'),
(@intento_id, 31, 'B', 1, '2026-03-09 14:47:43'),
(@intento_id, 32, 'B', 1, '2026-03-09 14:47:54'),
(@intento_id, 33, 'B', 1, '2026-03-09 14:48:05'),
(@intento_id, 34, 'G', 0, '2026-03-09 14:48:37'),
(@intento_id, 35, 'E', 0, '2026-03-09 14:49:02'),
(@intento_id, 36, 'B', 1, '2026-03-09 14:49:23'),
(@intento_id, 37, 'A', 0, '2026-03-09 14:49:36'),
(@intento_id, 38, 'C', 1, '2026-03-09 14:50:03'),
(@intento_id, 39, 'B', 1, '2026-03-09 14:50:13'),
(@intento_id, 40, 'B', 1, '2026-03-09 14:50:27'),
(@intento_id, 41, 'B', 1, '2026-03-09 14:51:09'),
(@intento_id, 42, 'G', 0, '2026-03-09 14:51:28'),
(@intento_id, 43, 'B', 1, '2026-03-09 14:51:40'),
(@intento_id, 44, 'B', 1, '2026-03-09 14:52:03'),
(@intento_id, 45, 'B', 1, '2026-03-09 14:52:36'),
(@intento_id, 46, 'C', 1, '2026-03-09 14:52:47'),
(@intento_id, 47, 'B', 1, '2026-03-09 14:52:55'),
(@intento_id, 48, 'C', 1, '2026-03-09 14:53:04'),
(@intento_id, 49, 'B', 1, '2026-03-09 14:53:15'),
(@intento_id, 50, 'A', 1, '2026-03-09 14:53:25');

-- Insertar resultado usando el ID del intento
INSERT INTO resultados (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje, calificacion, fecha_calculo) 
VALUES (@intento_id, 50, 34, 16, 68.00, 3.40, '2026-03-09 14:53:36');

-- Verificar que todo se insertó correctamente
SELECT 'VERIFICACIÓN:' as info;
SELECT 
    u.nombre_completo,
    u.cedula,
    ie.id as intento_id,
    ie.estado,
    r.porcentaje,
    r.respuestas_correctas,
    COUNT(re.id) as total_respuestas
FROM usuarios u
JOIN intentos_examen ie ON u.id = ie.usuario_id
JOIN resultados r ON ie.id = r.intento_id
JOIN respuestas_estudiante re ON ie.id = re.intento_id
WHERE u.nombre_completo LIKE '%Nury%'
GROUP BY u.id, ie.id, r.id;

-- ============================================
-- RESUMEN
-- ============================================
-- ✅ Intento creado para usuario existente
-- ✅ 50 respuestas insertadas (34 correctas, 16 incorrectas)
-- ✅ Resultado: 68% - Aprobado
-- ✅ Tiempo: 21m 11s (1271 segundos)
-- ============================================