<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    require_once __DIR__ . '/../app/controllers/ExamenController.php';
    
    $intentoId = intval($_GET['intento_id'] ?? 0);
    
    $controller = new ExamenController();
    $resultado = $controller->obtenerRespuestas($intentoId);
    
    echo json_encode($resultado);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor',
        'error' => $e->getMessage()
    ]);
}
