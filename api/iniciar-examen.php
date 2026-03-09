<?php
/**
 * API: Iniciar Examen
 */
// Mostrar errores temporalmente para debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    require_once __DIR__ . '/../app/controllers/ExamenController.php';
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $nombreCompleto = trim($input['nombre_completo'] ?? '');
    $cedula = trim($input['cedula'] ?? '');
    
    $controller = new ExamenController();
    $resultado = $controller->iniciarExamen($nombreCompleto, $cedula);
    
    echo json_encode($resultado);
    
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor',
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
