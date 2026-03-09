-- ============================================
-- MIGRACIÓN: Agregar campo de contraseña para administradores
-- ============================================

-- Agregar campo de contraseña (opcional, solo para administradores)
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL AFTER cedula;

-- Agregar campo tiempo_segundos para tracking del tiempo
ALTER TABLE intentos_examen 
ADD COLUMN IF NOT EXISTS tiempo_segundos INT DEFAULT 0 AFTER tiempo_restante;

-- Agregar campo calificacion a resultados
ALTER TABLE resultados 
ADD COLUMN IF NOT EXISTS calificacion DECIMAL(3,2) DEFAULT 0.00 AFTER porcentaje;

-- Actualizar administradores existentes con contraseñas
UPDATE usuarios 
SET password = 'admin123' 
WHERE cedula = 'admin' AND password IS NULL;

UPDATE usuarios 
SET password = 'oscar2026' 
WHERE cedula = 'oscar2026' AND password IS NULL;
