<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    require_once __DIR__ . '/../app/controllers/AdminController.php';
    
    $controller = new AdminController();
    $resultado = $controller->obtenerTodosResultados();
    
    echo json_encode($resultado);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor',
        'error' => $e->getMessage()
    ]);
}
