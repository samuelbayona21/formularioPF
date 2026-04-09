-- ============================================
-- ACTUALIZAR USUARIO: Nury Martinez (ID 20)
-- ============================================
-- Este script actualiza los datos existentes de Nury Martinez
-- Usuario ID: 20, Intento ID: 4, Resultado ID: 4
-- ============================================

-- Actualizar datos del usuario (si es necesario)
UPDATE usuarios 
SET nombre_completo = 'Nury Martinez', 
    cedula = '51891837'
WHERE id = 20;

-- Actualizar intento de examen
UPDATE intentos_examen 
SET fecha_inicio = '2026-03-09 14:32:25',
    fecha_fin = '2026-03-09 14:53:36',
    tiempo_segundos = 1271,
    estado = 'completado'
WHERE id = 4 AND usuario_id = 20;

-- Eliminar respuestas existentes para este intento
DELETE FROM respuestas_estudiante WHERE intento_id = 4;

-- Insertar las 50 respuestas nuevas
INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta, fecha_respuesta) VALUES
(4, 1, 'G', 0, '2026-03-09 14:33:20'),
(4, 2, 'G', 0, '2026-03-09 14:33:55'),
(4, 3, 'G', 0, '2026-03-09 14:34:54'),
(4, 4, 'E', 0, '2026-03-09 14:35:48'),
(4, 5, 'G', 0, '2026-03-09 14:36:47'),
(4, 6, 'F', 0, '2026-03-09 14:37:52'),
(4, 7, 'E', 0, '2026-03-09 14:38:52'),
(4, 8, 'B', 1, '2026-03-09 14:39:21'),
(4, 9, 'B', 1, '2026-03-09 14:39:40'),
(4, 10, 'C', 1, '2026-03-09 14:39:55'),
(4, 11, 'B', 1, '2026-03-09 14:40:12'),
(4, 12, 'B', 1, '2026-03-09 14:40:25'),
(4, 13, 'B', 1, '2026-03-09 14:40:46'),
(4, 14, 'B', 1, '2026-03-09 14:41:07'),
(4, 15, 'B', 1, '2026-03-09 14:41:19'),
(4, 16, 'E', 0, '2026-03-09 14:41:40'),
(4, 17, 'B', 1, '2026-03-09 14:42:06'),
(4, 18, 'B', 1, '2026-03-09 14:42:41'),
(4, 19, 'C', 1, '2026-03-09 14:43:51'),
(4, 20, 'B', 1, '2026-03-09 14:44:13'),
(4, 21, 'D', 0, '2026-03-09 14:44:43'),
(4, 22, 'B', 1, '2026-03-09 14:44:56'),
(4, 23, 'A', 0, '2026-03-09 14:45:23'),
(4, 24, 'C', 0, '2026-03-09 14:45:43'),
(4, 25, 'H', 0, '2026-03-09 14:46:19'),
(4, 26, 'B', 1, '2026-03-09 14:46:35'),
(4, 27, 'B', 1, '2026-03-09 14:46:46'),
(4, 28, 'C', 1, '2026-03-09 14:47:00'),
(4, 29, 'C', 1, '2026-03-09 14:47:13'),
(4, 30, 'B', 1, '2026-03-09 14:47:28'),
(4, 31, 'B', 1, '2026-03-09 14:47:43'),
(4, 32, 'B', 1, '2026-03-09 14:47:54'),
(4, 33, 'B', 1, '2026-03-09 14:48:05'),
(4, 34, 'G', 0, '2026-03-09 14:48:37'),
(4, 35, 'E', 0, '2026-03-09 14:49:02'),
(4, 36, 'B', 1, '2026-03-09 14:49:23'),
(4, 37, 'A', 0, '2026-03-09 14:49:36'),
(4, 38, 'C', 1, '2026-03-09 14:50:03'),
(4, 39, 'B', 1, '2026-03-09 14:50:13'),
(4, 40, 'B', 1, '2026-03-09 14:50:27'),
(4, 41, 'B', 1, '2026-03-09 14:51:09'),
(4, 42, 'G', 0, '2026-03-09 14:51:28'),
(4, 43, 'B', 1, '2026-03-09 14:51:40'),
(4, 44, 'B', 1, '2026-03-09 14:52:03'),
(4, 45, 'B', 1, '2026-03-09 14:52:36'),
(4, 46, 'C', 1, '2026-03-09 14:52:47'),
(4, 47, 'B', 1, '2026-03-09 14:52:55'),
(4, 48, 'C', 1, '2026-03-09 14:53:04'),
(4, 49, 'B', 1, '2026-03-09 14:53:15'),
(4, 50, 'A', 1, '2026-03-09 14:53:25');

-- Actualizar o insertar resultado
INSERT INTO resultados (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje, calificacion, fecha_calculo) 
VALUES (4, 50, 34, 16, 68.00, 3.40, '2026-03-09 14:53:36')
ON DUPLICATE KEY UPDATE
    total_preguntas = 50,
    respuestas_correctas = 34,
    respuestas_incorrectas = 16,
    porcentaje = 68.00,
    calificacion = 3.40,
    fecha_calculo = '2026-03-09 14:53:36';

-- ============================================
-- RESUMEN
-- ============================================
-- Usuario ID: 20 - Nury Martinez
-- Intento ID: 4 - Examen actualizado
-- Resultado ID: 4 - 68% (34/50 correctas)
-- Tiempo: 21m 11s (1271 segundos)
-- Estado: Aprobado ✅
-- ============================================