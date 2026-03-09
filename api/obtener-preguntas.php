<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Habilitar errores para debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    require_once __DIR__ . '/../app/controllers/ExamenController.php';
    
    $examenId = intval($_GET['examen_id'] ?? 1);
    
    $controller = new ExamenController();
    $resultado = $controller->obtenerPreguntas($examenId);
    
    echo json_encode($resultado);
    
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al cargar preguntas',
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
}
