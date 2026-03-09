<?php
header('Content-Type: application/json');

try {
    require_once __DIR__ . '/../app/controllers/ExamenController.php';
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $intentoId = intval($data['intento_id'] ?? 0);
    $tiempoTranscurrido = intval($data['tiempo_transcurrido'] ?? 0);
    
    $controller = new ExamenController();
    $resultado = $controller->guardarTiempo($intentoId, $tiempoTranscurrido);
    
    echo json_encode($resultado);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor',
        'error' => $e->getMessage()
    ]);
}
