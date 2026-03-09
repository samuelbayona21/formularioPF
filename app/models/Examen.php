<?php
/**
 * Modelo Examen - Maneja operaciones de exámenes e intentos
 */
require_once __DIR__ . '/../core/Database.php';

class Examen {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Buscar intento en progreso
     */
    public function buscarIntentoEnProgreso($usuarioId) {
        $stmt = $this->db->prepare(
            "SELECT id FROM intentos_examen WHERE usuario_id = ? AND estado = 'en_progreso'"
        );
        $stmt->execute([$usuarioId]);
        return $stmt->fetch();
    }
    
    /**
     * Crear nuevo intento
     */
    public function crearIntento($usuarioId, $examenId = 1) {
        $stmt = $this->db->prepare(
            "INSERT INTO intentos_examen (usuario_id, examen_id, estado) VALUES (?, ?, 'en_progreso')"
        );
        $stmt->execute([$usuarioId, $examenId]);
        return $this->db->lastInsertId();
    }
    
    /**
     * Obtener preguntas del examen
     */
    public function obtenerPreguntas($examenId) {
        $stmt = $this->db->prepare("SELECT * FROM preguntas WHERE examen_id = ? ORDER BY numero_pregunta");
        $stmt->execute([$examenId]);
        return $stmt->fetchAll();
    }
    
    /**
     * Obtener opciones de una pregunta
     */
    public function obtenerOpciones($preguntaId) {
        $stmt = $this->db->prepare(
            "SELECT id, letra_opcion, texto_opcion FROM opciones WHERE pregunta_id = ? ORDER BY letra_opcion"
        );
        $stmt->execute([$preguntaId]);
        return $stmt->fetchAll();
    }
    
    /**
     * Obtener tiempo transcurrido
     */
    public function obtenerTiempoTranscurrido($intentoId) {
        $stmt = $this->db->prepare("SELECT tiempo_segundos FROM intentos_examen WHERE id = ?");
        $stmt->execute([$intentoId]);
        $resultado = $stmt->fetch();
        return $resultado ? intval($resultado['tiempo_segundos']) : 0;
    }
    
    /**
     * Actualizar tiempo transcurrido
     */
    public function actualizarTiempo($intentoId, $tiempoSegundos) {
        $stmt = $this->db->prepare("UPDATE intentos_examen SET tiempo_segundos = ? WHERE id = ?");
        return $stmt->execute([$tiempoSegundos, $intentoId]);
    }
    
    /**
     * Finalizar intento
     */
    public function finalizarIntento($intentoId, $tiempoAgotado = false) {
        $estado = $tiempoAgotado ? 'tiempo_agotado' : 'finalizado';
        $stmt = $this->db->prepare(
            "UPDATE intentos_examen SET fecha_fin = NOW(), estado = ? WHERE id = ?"
        );
        return $stmt->execute([$estado, $intentoId]);
    }
    
    /**
     * Obtener datos del intento
     */
    public function obtenerIntento($intentoId) {
        $stmt = $this->db->prepare("
            SELECT ie.*, e.total_preguntas 
            FROM intentos_examen ie 
            JOIN examenes e ON ie.examen_id = e.id 
            WHERE ie.id = ?
        ");
        $stmt->execute([$intentoId]);
        return $stmt->fetch();
    }
}
