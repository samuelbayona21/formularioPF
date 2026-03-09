-- Actualizar nombre del examen
UPDATE examenes 
SET titulo = 'Prueba de Conocimiento GAF', 
    descripcion = 'Evaluación de conocimientos generales',
    duracion_minutos = 25
WHERE id = 1;
