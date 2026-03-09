<?php
/**
 * Modelo Usuario - Maneja operaciones de usuarios
 */
require_once __DIR__ . '/../core/Database.php';

class Usuario {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Buscar usuario por cédula
     */
    public function buscarPorCedula($cedula) {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE cedula = ?");
        $stmt->execute([$cedula]);
        return $stmt->fetch();
    }
    
    /**
     * Crear nuevo usuario
     */
    public function crear($nombreCompleto, $cedula, $tipoUsuario = 'estudiante') {
        $stmt = $this->db->prepare(
            "INSERT INTO usuarios (nombre_completo, cedula, tipo_usuario) VALUES (?, ?, ?)"
        );
        $stmt->execute([$nombreCompleto, $cedula, $tipoUsuario]);
        return $this->db->lastInsertId();
    }
    
    /**
     * Actualizar nombre de usuario
     */
    public function actualizarNombre($usuarioId, $nombreCompleto) {
        $stmt = $this->db->prepare("UPDATE usuarios SET nombre_completo = ? WHERE id = ?");
        return $stmt->execute([$nombreCompleto, $usuarioId]);
    }
    
    /**
     * Obtener o crear usuario
     */
    public function obtenerOCrear($nombreCompleto, $cedula) {
        $usuario = $this->buscarPorCedula($cedula);
        
        if ($usuario) {
            // Actualizar nombre si es diferente
            if ($usuario['nombre_completo'] !== $nombreCompleto) {
                $this->actualizarNombre($usuario['id'], $nombreCompleto);
            }
            return $usuario['id'];
        }
        
        return $this->crear($nombreCompleto, $cedula);
    }
}
