-- Script para resetear completamente el sistema manteniendo solo administradores
-- ADVERTENCIA: Esto eliminará todos los datos de estudiantes y sus exámenes

-- Desactivar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar resultados
TRUNCATE TABLE resultados;

-- Limpiar respuestas de estudiantes
TRUNCATE TABLE respuestas_estudiante;

-- Limpiar intentos de examen
TRUNCATE TABLE intentos_examen;

-- Eliminar usuarios que NO son administradores
DELETE FROM usuarios WHERE tipo_usuario != 'administrador';

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Mostrar administradores que se mantuvieron
SELECT 
    id,
    nombre_completo,
    cedula,
    tipo_usuario,
    fecha_registro
FROM usuarios
WHERE tipo_usuario = 'administrador'
ORDER BY fecha_registro ASC;

-- Mensaje de confirmación
SELECT 'Sistema reseteado. Solo administradores preservados.' AS mensaje;
