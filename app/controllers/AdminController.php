<?php
/**
 * Controlador de Administración
 * Maneja las peticiones del panel administrativo
 */

require_once __DIR__ . '/../core/Database.php';

class AdminController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Obtener todos los resultados
     */
    public function obtenerTodosResultados() {
        try {
            $stmt = $this->db->prepare("
                SELECT 
                    ie.id as intento_id,
                    u.nombre_completo,
                    u.cedula,
                    r.porcentaje,
                    r.respuestas_correctas as correctas,
                    r.respuestas_incorrectas as incorrectas,
                    r.total_preguntas,
                    (1500 - ie.tiempo_restante) as tiempo_segundos,
                    ie.fecha_inicio as fecha
                FROM intentos_examen ie
                JOIN usuarios u ON ie.usuario_id = u.id
                LEFT JOIN resultados r ON ie.id = r.intento_id
                WHERE ie.estado IN ('finalizado', 'tiempo_agotado')
                ORDER BY ie.fecha_inicio DESC
            ");
            $stmt->execute();
            $resultados = $stmt->fetchAll();
            
            return [
                'success' => true,
                'resultados' => $resultados
            ];
            
        } catch (Exception $e) {
            error_log("Error en obtenerTodosResultados: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener resultados',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Obtener detalle de un examen
     */
    public function obtenerDetalleExamen($intentoId) {
        try {
            if (empty($intentoId)) {
                return [
                    'success' => false,
                    'message' => 'ID de intento no proporcionado'
                ];
            }
            
            // Información del intento
            $stmt = $this->db->prepare("
                SELECT 
                    ie.*,
                    u.nombre_completo,
                    u.cedula,
                    r.porcentaje,
                    r.respuestas_correctas,
                    r.respuestas_incorrectas,
                    r.total_preguntas
                FROM intentos_examen ie
                JOIN usuarios u ON ie.usuario_id = u.id
                LEFT JOIN resultados r ON ie.id = r.intento_id
                WHERE ie.id = ?
            ");
            $stmt->execute([$intentoId]);
            $intento = $stmt->fetch();
            
            if (!$intento) {
                return [
                    'success' => false,
                    'message' => 'Intento no encontrado'
                ];
            }
            
            // Respuestas del estudiante
            $stmt = $this->db->prepare("
                SELECT 
                    p.id as pregunta_id,
                    p.numero_pregunta,
                    p.texto_pregunta,
                    p.respuesta_correcta,
                    re.respuesta_seleccionada,
                    re.es_correcta
                FROM preguntas p
                LEFT JOIN respuestas_estudiante re ON p.id = re.pregunta_id AND re.intento_id = ?
                WHERE p.examen_id = ?
                ORDER BY p.numero_pregunta
            ");
            $stmt->execute([$intentoId, $intento['examen_id']]);
            $respuestas = $stmt->fetchAll();
            
            // Opciones de cada pregunta
            foreach ($respuestas as &$respuesta) {
                $stmt = $this->db->prepare("
                    SELECT letra_opcion, texto_opcion
                    FROM opciones
                    WHERE pregunta_id = ?
                    ORDER BY letra_opcion
                ");
                $stmt->execute([$respuesta['pregunta_id']]);
                $respuesta['opciones'] = $stmt->fetchAll();
            }
            
            return [
                'success' => true,
                'intento' => $intento,
                'respuestas' => $respuestas
            ];
            
        } catch (Exception $e) {
            error_log("Error en obtenerDetalleExamen: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener detalle'
            ];
        }
    }
}
