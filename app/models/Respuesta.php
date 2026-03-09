<?php
/**
 * Modelo Respuesta - Maneja respuestas de estudiantes
 */
require_once __DIR__ . '/../core/Database.php';

class Respuesta {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Obtener respuesta correcta de una pregunta
     */
    public function obtenerRespuestaCorrecta($preguntaId) {
        $stmt = $this->db->prepare("SELECT respuesta_correcta FROM preguntas WHERE id = ?");
        $stmt->execute([$preguntaId]);
        $resultado = $stmt->fetch();
        return $resultado ? $resultado['respuesta_correcta'] : null;
    }
    
    /**
     * Buscar respuesta existente
     */
    public function buscarRespuesta($intentoId, $preguntaId) {
        $stmt = $this->db->prepare(
            "SELECT id FROM respuestas_estudiante WHERE intento_id = ? AND pregunta_id = ?"
        );
        $stmt->execute([$intentoId, $preguntaId]);
        return $stmt->fetch();
    }
    
    /**
     * Guardar nueva respuesta
     */
    public function crear($intentoId, $preguntaId, $respuestaSeleccionada, $esCorrecta) {
        $stmt = $this->db->prepare("
            INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta) 
            VALUES (?, ?, ?, ?)
        ");
        return $stmt->execute([$intentoId, $preguntaId, $respuestaSeleccionada, $esCorrecta]);
    }
    
    /**
     * Actualizar respuesta existente
     */
    public function actualizar($respuestaId, $respuestaSeleccionada, $esCorrecta) {
        $stmt = $this->db->prepare("
            UPDATE respuestas_estudiante 
            SET respuesta_seleccionada = ?, es_correcta = ? 
            WHERE id = ?
        ");
        return $stmt->execute([$respuestaSeleccionada, $esCorrecta, $respuestaId]);
    }
    
    /**
     * Obtener respuestas de un intento
     */
    public function obtenerRespuestasIntento($intentoId) {
        $stmt = $this->db->prepare(
            "SELECT pregunta_id, respuesta_seleccionada FROM respuestas_estudiante WHERE intento_id = ?"
        );
        $stmt->execute([$intentoId]);
        return $stmt->fetchAll();
    }
    
    /**
     * Contar respuestas correctas e incorrectas
     */
    public function contarRespuestas($intentoId) {
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(*) as total_respondidas,
                SUM(CASE WHEN es_correcta = 1 THEN 1 ELSE 0 END) as correctas,
                SUM(CASE WHEN es_correcta = 0 THEN 1 ELSE 0 END) as incorrectas
            FROM respuestas_estudiante 
            WHERE intento_id = ?
        ");
        $stmt->execute([$intentoId]);
        return $stmt->fetch();
    }
}
