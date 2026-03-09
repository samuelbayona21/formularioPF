-- Script para limpiar datos de exámenes manteniendo usuarios
-- Útil para resetear el sistema sin perder usuarios administradores

-- Desactivar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar resultados
TRUNCATE TABLE resultados;

-- Limpiar respuestas de estudiantes
TRUNCATE TABLE respuestas_estudiante;

-- Limpiar intentos de examen
TRUNCATE TABLE intentos_examen;

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Mostrar usuarios que se mantuvieron
SELECT 
    id,
    nombre_completo,
    cedula,
    tipo_usuario,
    fecha_registro
FROM usuarios
ORDER BY tipo_usuario DESC, fecha_registro ASC;

-- Mensaje de confirmación
SELECT 'Datos de exámenes limpiados. Usuarios preservados.' AS mensaje;
