-- ============================================
-- INSERTAR USUARIOS DE PRUEBA PARA TOP 5
-- ============================================
-- Este script inserta 5 usuarios con diferentes resultados
-- para probar el Top 5 Mejores Resultados
-- ============================================

-- Usuario 1: María García (Excelente - 96%)
INSERT INTO usuarios (nombre_completo, cedula, tipo_usuario, fecha_registro) 
VALUES ('María García', '12345678', 'estudiante', '2026-03-08 10:00:00');
SET @usuario1_id = LAST_INSERT_ID();

INSERT INTO intentos_examen (usuario_id, examen_id, fecha_inicio, fecha_fin, tiempo_segundos, estado) 
VALUES (@usuario1_id, 1, '2026-03-08 10:00:00', '2026-03-08 10:18:30', 1110, 'finalizado');
SET @intento1_id = LAST_INSERT_ID();

-- 48 respuestas correctas de 50 (96%)
INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta) VALUES
(@intento1_id, 1, 'C', 1), (@intento1_id, 2, 'B', 1), (@intento1_id, 3, 'B', 1), (@intento1_id, 4, 'C', 1), (@intento1_id, 5, 'C', 1),
(@intento1_id, 6, 'C', 1), (@intento1_id, 7, 'C', 1), (@intento1_id, 8, 'B', 1), (@intento1_id, 9, 'B', 1), (@intento1_id, 10, 'C', 1),
(@intento1_id, 11, 'B', 1), (@intento1_id, 12, 'B', 1), (@intento1_id, 13, 'B', 1), (@intento1_id, 14, 'B', 1), (@intento1_id, 15, 'B', 1),
(@intento1_id, 16, 'C', 1), (@intento1_id, 17, 'B', 1), (@intento1_id, 18, 'B', 1), (@intento1_id, 19, 'C', 1), (@intento1_id, 20, 'B', 1),
(@intento1_id, 21, 'B', 1), (@intento1_id, 22, 'B', 1), (@intento1_id, 23, 'B', 1), (@intento1_id, 24, 'D', 1), (@intento1_id, 25, 'B', 1),
(@intento1_id, 26, 'B', 1), (@intento1_id, 27, 'B', 1), (@intento1_id, 28, 'C', 1), (@intento1_id, 29, 'C', 1), (@intento1_id, 30, 'B', 1),
(@intento1_id, 31, 'B', 1), (@intento1_id, 32, 'B', 1), (@intento1_id, 33, 'B', 1), (@intento1_id, 34, 'A', 1), (@intento1_id, 35, 'A', 1),
(@intento1_id, 36, 'B', 1), (@intento1_id, 37, 'C', 1), (@intento1_id, 38, 'B', 1), (@intento1_id, 39, 'B', 1), (@intento1_id, 40, 'B', 1),
(@intento1_id, 41, 'B', 1), (@intento1_id, 42, 'B', 1), (@intento1_id, 43, 'B', 1), (@intento1_id, 44, 'B', 1), (@intento1_id, 45, 'B', 1),
(@intento1_id, 46, 'C', 1), (@intento1_id, 47, 'B', 1), (@intento1_id, 48, 'C', 1), (@intento1_id, 49, 'A', 0), (@intento1_id, 50, 'B', 0);

INSERT INTO resultados (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje, calificacion) 
VALUES (@intento1_id, 50, 48, 2, 96.00, 4.80);

-- Usuario 2: Carlos López (Muy Bueno - 88%)
INSERT INTO usuarios (nombre_completo, cedula, tipo_usuario, fecha_registro) 
VALUES ('Carlos López', '87654321', 'estudiante', '2026-03-08 11:00:00');
SET @usuario2_id = LAST_INSERT_ID();

INSERT INTO intentos_examen (usuario_id, examen_id, fecha_inicio, fecha_fin, tiempo_segundos, estado) 
VALUES (@usuario2_id, 1, '2026-03-08 11:00:00', '2026-03-08 11:22:15', 1335, 'finalizado');
SET @intento2_id = LAST_INSERT_ID();

-- 44 respuestas correctas de 50 (88%)
INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta) VALUES
(@intento2_id, 1, 'C', 1), (@intento2_id, 2, 'B', 1), (@intento2_id, 3, 'B', 1), (@intento2_id, 4, 'C', 1), (@intento2_id, 5, 'C', 1),
(@intento2_id, 6, 'C', 1), (@intento2_id, 7, 'C', 1), (@intento2_id, 8, 'B', 1), (@intento2_id, 9, 'B', 1), (@intento2_id, 10, 'C', 1),
(@intento2_id, 11, 'B', 1), (@intento2_id, 12, 'B', 1), (@intento2_id, 13, 'B', 1), (@intento2_id, 14, 'B', 1), (@intento2_id, 15, 'B', 1),
(@intento2_id, 16, 'C', 1), (@intento2_id, 17, 'B', 1), (@intento2_id, 18, 'B', 1), (@intento2_id, 19, 'C', 1), (@intento2_id, 20, 'B', 1),
(@intento2_id, 21, 'B', 1), (@intento2_id, 22, 'B', 1), (@intento2_id, 23, 'A', 0), (@intento2_id, 24, 'D', 1), (@intento2_id, 25, 'B', 1),
(@intento2_id, 26, 'B', 1), (@intento2_id, 27, 'B', 1), (@intento2_id, 28, 'C', 1), (@intento2_id, 29, 'C', 1), (@intento2_id, 30, 'B', 1),
(@intento2_id, 31, 'B', 1), (@intento2_id, 32, 'B', 1), (@intento2_id, 33, 'B', 1), (@intento2_id, 34, 'B', 0), (@intento2_id, 35, 'A', 1),
(@intento2_id, 36, 'B', 1), (@intento2_id, 37, 'C', 1), (@intento2_id, 38, 'B', 1), (@intento2_id, 39, 'B', 1), (@intento2_id, 40, 'B', 1),
(@intento2_id, 41, 'B', 1), (@intento2_id, 42, 'B', 1), (@intento2_id, 43, 'A', 0), (@intento2_id, 44, 'B', 1), (@intento2_id, 45, 'B', 1),
(@intento2_id, 46, 'C', 1), (@intento2_id, 47, 'B', 1), (@intento2_id, 48, 'A', 0), (@intento2_id, 49, 'B', 1), (@intento2_id, 50, 'A', 1);

INSERT INTO resultados (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje, calificacion) 
VALUES (@intento2_id, 50, 44, 6, 88.00, 4.40);

-- Usuario 3: Ana Rodríguez (Bueno - 76%)
INSERT INTO usuarios (nombre_completo, cedula, tipo_usuario, fecha_registro) 
VALUES ('Ana Rodríguez', '11223344', 'estudiante', '2026-03-08 14:00:00');
SET @usuario3_id = LAST_INSERT_ID();

INSERT INTO intentos_examen (usuario_id, examen_id, fecha_inicio, fecha_fin, tiempo_segundos, estado) 
VALUES (@usuario3_id, 1, '2026-03-08 14:00:00', '2026-03-08 14:25:45', 1545, 'finalizado');
SET @intento3_id = LAST_INSERT_ID();

-- 38 respuestas correctas de 50 (76%)
INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta) VALUES
(@intento3_id, 1, 'C', 1), (@intento3_id, 2, 'B', 1), (@intento3_id, 3, 'B', 1), (@intento3_id, 4, 'C', 1), (@intento3_id, 5, 'C', 1),
(@intento3_id, 6, 'C', 1), (@intento3_id, 7, 'C', 1), (@intento3_id, 8, 'B', 1), (@intento3_id, 9, 'B', 1), (@intento3_id, 10, 'C', 1),
(@intento3_id, 11, 'B', 1), (@intento3_id, 12, 'B', 1), (@intento3_id, 13, 'B', 1), (@intento3_id, 14, 'B', 1), (@intento3_id, 15, 'B', 1),
(@intento3_id, 16, 'A', 0), (@intento3_id, 17, 'B', 1), (@intento3_id, 18, 'B', 1), (@intento3_id, 19, 'C', 1), (@intento3_id, 20, 'B', 1),
(@intento3_id, 21, 'A', 0), (@intento3_id, 22, 'B', 1), (@intento3_id, 23, 'A', 0), (@intento3_id, 24, 'D', 1), (@intento3_id, 25, 'B', 1),
(@intento3_id, 26, 'B', 1), (@intento3_id, 27, 'B', 1), (@intento3_id, 28, 'C', 1), (@intento3_id, 29, 'C', 1), (@intento3_id, 30, 'B', 1),
(@intento3_id, 31, 'B', 1), (@intento3_id, 32, 'B', 1), (@intento3_id, 33, 'B', 1), (@intento3_id, 34, 'B', 0), (@intento3_id, 35, 'A', 1),
(@intento3_id, 36, 'B', 1), (@intento3_id, 37, 'A', 0), (@intento3_id, 38, 'B', 1), (@intento3_id, 39, 'B', 1), (@intento3_id, 40, 'B', 1),
(@intento3_id, 41, 'A', 0), (@intento3_id, 42, 'B', 1), (@intento3_id, 43, 'A', 0), (@intento3_id, 44, 'B', 1), (@intento3_id, 45, 'B', 1),
(@intento3_id, 46, 'C', 1), (@intento3_id, 47, 'B', 1), (@intento3_id, 48, 'A', 0), (@intento3_id, 49, 'B', 1), (@intento3_id, 50, 'A', 1);

INSERT INTO resultados (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje, calificacion) 
VALUES (@intento3_id, 50, 38, 12, 76.00, 3.80);

-- Usuario 4: Pedro Martínez (Regular - 62%)
INSERT INTO usuarios (nombre_completo, cedula, tipo_usuario, fecha_registro) 
VALUES ('Pedro Martínez', '55667788', 'estudiante', '2026-03-08 15:30:00');
SET @usuario4_id = LAST_INSERT_ID();

INSERT INTO intentos_examen (usuario_id, examen_id, fecha_inicio, fecha_fin, tiempo_segundos, estado) 
VALUES (@usuario4_id, 1, '2026-03-08 15:30:00', '2026-03-08 15:55:20', 1520, 'finalizado');
SET @intento4_id = LAST_INSERT_ID();

-- 31 respuestas correctas de 50 (62%)
INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta) VALUES
(@intento4_id, 1, 'C', 1), (@intento4_id, 2, 'B', 1), (@intento4_id, 3, 'B', 1), (@intento4_id, 4, 'C', 1), (@intento4_id, 5, 'C', 1),
(@intento4_id, 6, 'C', 1), (@intento4_id, 7, 'C', 1), (@intento4_id, 8, 'B', 1), (@intento4_id, 9, 'B', 1), (@intento4_id, 10, 'C', 1),
(@intento4_id, 11, 'B', 1), (@intento4_id, 12, 'B', 1), (@intento4_id, 13, 'B', 1), (@intento4_id, 14, 'B', 1), (@intento4_id, 15, 'B', 1),
(@intento4_id, 16, 'A', 0), (@intento4_id, 17, 'B', 1), (@intento4_id, 18, 'B', 1), (@intento4_id, 19, 'C', 1), (@intento4_id, 20, 'B', 1),
(@intento4_id, 21, 'A', 0), (@intento4_id, 22, 'B', 1), (@intento4_id, 23, 'A', 0), (@intento4_id, 24, 'A', 0), (@intento4_id, 25, 'A', 0),
(@intento4_id, 26, 'B', 1), (@intento4_id, 27, 'B', 1), (@intento4_id, 28, 'A', 0), (@intento4_id, 29, 'A', 0), (@intento4_id, 30, 'B', 1),
(@intento4_id, 31, 'B', 1), (@intento4_id, 32, 'B', 1), (@intento4_id, 33, 'B', 1), (@intento4_id, 34, 'B', 0), (@intento4_id, 35, 'A', 1),
(@intento4_id, 36, 'B', 1), (@intento4_id, 37, 'A', 0), (@intento4_id, 38, 'B', 1), (@intento4_id, 39, 'B', 1), (@intento4_id, 40, 'B', 1),
(@intento4_id, 41, 'A', 0), (@intento4_id, 42, 'B', 1), (@intento4_id, 43, 'A', 0), (@intento4_id, 44, 'A', 0), (@intento4_id, 45, 'A', 0),
(@intento4_id, 46, 'C', 1), (@intento4_id, 47, 'B', 1), (@intento4_id, 48, 'A', 0), (@intento4_id, 49, 'A', 0), (@intento4_id, 50, 'A', 1);

INSERT INTO resultados (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje, calificacion) 
VALUES (@intento4_id, 50, 31, 19, 62.00, 3.10);

-- Usuario 5: Laura Sánchez (Deficiente - 48%)
INSERT INTO usuarios (nombre_completo, cedula, tipo_usuario, fecha_registro) 
VALUES ('Laura Sánchez', '99887766', 'estudiante', '2026-03-08 16:00:00');
SET @usuario5_id = LAST_INSERT_ID();

INSERT INTO intentos_examen (usuario_id, examen_id, fecha_inicio, fecha_fin, tiempo_segundos, estado) 
VALUES (@usuario5_id, 1, '2026-03-08 16:00:00', '2026-03-08 16:24:10', 1450, 'finalizado');
SET @intento5_id = LAST_INSERT_ID();

-- 24 respuestas correctas de 50 (48%)
INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta) VALUES
(@intento5_id, 1, 'C', 1), (@intento5_id, 2, 'B', 1), (@intento5_id, 3, 'B', 1), (@intento5_id, 4, 'C', 1), (@intento5_id, 5, 'C', 1),
(@intento5_id, 6, 'C', 1), (@intento5_id, 7, 'C', 1), (@intento5_id, 8, 'B', 1), (@intento5_id, 9, 'B', 1), (@intento5_id, 10, 'C', 1),
(@intento5_id, 11, 'B', 1), (@intento5_id, 12, 'B', 1), (@intento5_id, 13, 'B', 1), (@intento5_id, 14, 'B', 1), (@intento5_id, 15, 'B', 1),
(@intento5_id, 16, 'A', 0), (@intento5_id, 17, 'A', 0), (@intento5_id, 18, 'A', 0), (@intento5_id, 19, 'A', 0), (@intento5_id, 20, 'A', 0),
(@intento5_id, 21, 'A', 0), (@intento5_id, 22, 'A', 0), (@intento5_id, 23, 'A', 0), (@intento5_id, 24, 'A', 0), (@intento5_id, 25, 'A', 0),
(@intento5_id, 26, 'A', 0), (@intento5_id, 27, 'A', 0), (@intento5_id, 28, 'A', 0), (@intento5_id, 29, 'A', 0), (@intento5_id, 30, 'A', 0),
(@intento5_id, 31, 'A', 0), (@intento5_id, 32, 'A', 0), (@intento5_id, 33, 'A', 0), (@intento5_id, 34, 'A', 0), (@intento5_id, 35, 'A', 1),
(@intento5_id, 36, 'B', 1), (@intento5_id, 37, 'A', 0), (@intento5_id, 38, 'B', 1), (@intento5_id, 39, 'B', 1), (@intento5_id, 40, 'B', 1),
(@intento5_id, 41, 'A', 0), (@intento5_id, 42, 'B', 1), (@intento5_id, 43, 'A', 0), (@intento5_id, 44, 'A', 0), (@intento5_id, 45, 'A', 0),
(@intento5_id, 46, 'C', 1), (@intento5_id, 47, 'B', 1), (@intento5_id, 48, 'C', 1), (@intento5_id, 49, 'B', 1), (@intento5_id, 50, 'A', 1);

INSERT INTO resultados (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje, calificacion) 
VALUES (@intento5_id, 50, 24, 26, 48.00, 2.40);

-- Verificación final
SELECT 'USUARIOS DE PRUEBA INSERTADOS:' as resultado;
SELECT 
    u.nombre_completo,
    u.cedula,
    r.porcentaje,
    r.respuestas_correctas,
    ie.tiempo_segundos,
    CASE 
        WHEN r.porcentaje >= 90 THEN '🥇 Excelente'
        WHEN r.porcentaje >= 80 THEN '🥈 Muy Bueno'
        WHEN r.porcentaje >= 70 THEN '🥉 Bueno'
        WHEN r.porcentaje >= 60 THEN '✅ Aprobado'
        ELSE '❌ Reprobado'
    END as clasificacion
FROM usuarios u
JOIN intentos_examen ie ON u.id = ie.usuario_id
JOIN resultados r ON ie.id = r.intento_id
WHERE u.tipo_usuario = 'estudiante'
ORDER BY r.porcentaje DESC, ie.tiempo_segundos ASC;

-- ============================================
-- RESUMEN DE USUARIOS DE PRUEBA
-- ============================================
-- 🥇 María García - 96% (48/50) - 18m 30s
-- 🥈 Carlos López - 88% (44/50) - 22m 15s  
-- 🥉 Ana Rodríguez - 76% (38/50) - 25m 45s
-- 4️⃣ Pedro Martínez - 62% (31/50) - 25m 20s
-- 5️⃣ Laura Sánchez - 48% (24/50) - 24m 10s
-- ============================================