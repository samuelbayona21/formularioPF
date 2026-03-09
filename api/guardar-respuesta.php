<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    require_once __DIR__ . '/../app/controllers/ExamenController.php';
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $intentoId = intval($input['intento_id'] ?? 0);
    $preguntaId = intval($input['pregunta_id'] ?? 0);
    $respuesta = trim($input['respuesta'] ?? '');
    
    $controller = new ExamenController();
    $resultado = $controller->guardarRespuesta($intentoId, $preguntaId, $respuesta);
    
    echo json_encode($resultado);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor',
        'error' => $e->getMessage()
    ]);
}
