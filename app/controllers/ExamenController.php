<?php
/**
 * Controlador de Examen
 * Maneja las peticiones relacionadas con exámenes
 */

require_once __DIR__ . '/../models/Usuario.php';
require_once __DIR__ . '/../models/Examen.php';
require_once __DIR__ . '/../models/Respuesta.php';
require_once __DIR__ . '/../models/Resultado.php';

class ExamenController {
    private $usuarioModel;
    private $examenModel;
    private $respuestaModel;
    private $resultadoModel;
    
    public function __construct() {
        $this->usuarioModel = new Usuario();
        $this->examenModel = new Examen();
        $this->respuestaModel = new Respuesta();
        $this->resultadoModel = new Resultado();
    }
    
    /**
     * Iniciar un nuevo examen
     */
    public function iniciarExamen($nombreCompleto, $cedula) {
        try {
            // Validar datos
            if (empty($nombreCompleto) || empty($cedula)) {
                return [
                    'success' => false,
                    'message' => 'Datos incompletos'
                ];
            }
            
            // Obtener o crear usuario
            $usuarioId = $this->usuarioModel->obtenerOCrear($nombreCompleto, $cedula);
            
            // Verificar si ya tiene un examen en progreso
            $intentoExistente = $this->examenModel->buscarIntentoEnProgreso($usuarioId);
            
            if ($intentoExistente) {
                $intentoId = $intentoExistente['id'];
            } else {
                $intentoId = $this->examenModel->crearIntento($usuarioId);
            }
            
            return [
                'success' => true,
                'usuario_id' => $usuarioId,
                'intento_id' => $intentoId,
                'message' => 'Examen iniciado correctamente'
            ];
            
        } catch (Exception $e) {
            error_log("Error en iniciarExamen: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error en el servidor'
            ];
        }
    }
    
    /**
     * Obtener preguntas del examen
     */
    public function obtenerPreguntas($examenId = 1) {
        try {
            $preguntas = $this->examenModel->obtenerPreguntas($examenId);
            
            // Agregar opciones a cada pregunta
            foreach ($preguntas as &$pregunta) {
                $pregunta['opciones'] = $this->examenModel->obtenerOpciones($pregunta['id']);
            }
            
            return [
                'success' => true,
                'preguntas' => $preguntas
            ];
            
        } catch (Exception $e) {
            error_log("Error en obtenerPreguntas: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al cargar preguntas',
                'error_detail' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Guardar respuesta de estudiante
     */
    public function guardarRespuesta($intentoId, $preguntaId, $respuesta) {
        try {
            // Validar datos
            if (empty($intentoId) || empty($preguntaId) || empty($respuesta)) {
                return [
                    'success' => false,
                    'message' => 'Datos incompletos'
                ];
            }
            
            // Obtener respuesta correcta
            $respuestaCorrecta = $this->respuestaModel->obtenerRespuestaCorrecta($preguntaId);
            
            if (!$respuestaCorrecta) {
                return [
                    'success' => false,
                    'message' => 'Pregunta no encontrada'
                ];
            }
            
            $esCorrecta = ($respuesta === $respuestaCorrecta) ? 1 : 0;
            
            // Verificar si ya existe una respuesta
            $respuestaExistente = $this->respuestaModel->buscarRespuesta($intentoId, $preguntaId);
            
            if ($respuestaExistente) {
                $this->respuestaModel->actualizar($respuestaExistente['id'], $respuesta, $esCorrecta);
            } else {
                $this->respuestaModel->crear($intentoId, $preguntaId, $respuesta, $esCorrecta);
            }
            
            return [
                'success' => true,
                'message' => 'Respuesta guardada correctamente'
            ];
            
        } catch (Exception $e) {
            error_log("Error en guardarRespuesta: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al guardar respuesta'
            ];
        }
    }
    
    /**
     * Obtener respuestas guardadas
     */
    public function obtenerRespuestas($intentoId) {
        try {
            $respuestas = $this->respuestaModel->obtenerRespuestasIntento($intentoId);
            
            return [
                'success' => true,
                'respuestas' => $respuestas
            ];
            
        } catch (Exception $e) {
            error_log("Error en obtenerRespuestas: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al cargar respuestas'
            ];
        }
    }
    
    /**
     * Guardar tiempo transcurrido
     */
    public function guardarTiempo($intentoId, $tiempoSegundos) {
        try {
            if (empty($intentoId) || $tiempoSegundos === null) {
                return [
                    'success' => false,
                    'message' => 'Datos incompletos'
                ];
            }
            
            $this->examenModel->actualizarTiempo($intentoId, $tiempoSegundos);
            
            return ['success' => true];
            
        } catch (Exception $e) {
            error_log("Error en guardarTiempo: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al guardar tiempo'
            ];
        }
    }
    
    /**
     * Obtener tiempo transcurrido
     */
    public function obtenerTiempo($intentoId) {
        try {
            if (empty($intentoId)) {
                return [
                    'success' => false,
                    'message' => 'ID de intento no proporcionado'
                ];
            }
            
            $tiempoTranscurrido = $this->examenModel->obtenerTiempoTranscurrido($intentoId);
            
            return [
                'success' => true,
                'tiempo_transcurrido' => $tiempoTranscurrido
            ];
            
        } catch (Exception $e) {
            error_log("Error en obtenerTiempo: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener tiempo'
            ];
        }
    }
    
    /**
     * Finalizar examen
     */
    public function finalizarExamen($intentoId, $tiempoAgotado = false) {
        try {
            if (empty($intentoId)) {
                return [
                    'success' => false,
                    'message' => 'Datos incompletos'
                ];
            }
            
            // Obtener datos del intento
            $intento = $this->examenModel->obtenerIntento($intentoId);
            
            if (!$intento) {
                return [
                    'success' => false,
                    'message' => 'Intento de examen no encontrado'
                ];
            }
            
            $totalPreguntas = $intento['total_preguntas'];
            
            // Contar respuestas
            $conteo = $this->respuestaModel->contarRespuestas($intentoId);
            $correctas = intval($conteo['correctas']);
            $incorrectas = intval($conteo['incorrectas']);
            $porcentaje = ($totalPreguntas > 0) ? round(($correctas / $totalPreguntas) * 100, 2) : 0;
            
            // Obtener calificación
            $rangoCalificacion = $this->resultadoModel->obtenerCalificacion($porcentaje);
            $calificacionTexto = $rangoCalificacion ? $rangoCalificacion['calificacion'] : 'Sin calificación';
            $descripcionCalificacion = $rangoCalificacion ? $rangoCalificacion['descripcion'] : '';
            
            // Finalizar intento
            $this->examenModel->finalizarIntento($intentoId, $tiempoAgotado);
            
            // Guardar resultado
            $this->resultadoModel->guardar($intentoId, $totalPreguntas, $correctas, $incorrectas, $porcentaje);
            
            return [
                'success' => true,
                'resultado' => [
                    'total_preguntas' => $totalPreguntas,
                    'correctas' => $correctas,
                    'incorrectas' => $incorrectas,
                    'porcentaje' => $porcentaje,
                    'calificacion' => $calificacionTexto,
                    'descripcion' => $descripcionCalificacion
                ]
            ];
            
        } catch (Exception $e) {
            error_log("Error en finalizarExamen: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al finalizar examen'
            ];
        }
    }
}
