<?php
/**
 * Clase de Seguridad
 * Maneja autenticación, validación y protección
 */

class Security {
    
    /**
     * Iniciar sesión segura
     */
    public static function iniciarSesion() {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', 1);
            ini_set('session.use_only_cookies', 1);
            ini_set('session.cookie_secure', 0); // Cambiar a 1 en HTTPS
            session_start();
        }
    }
    
    /**
     * Validar sesión de estudiante
     */
    public static function validarSesionEstudiante() {
        self::iniciarSesion();
        
        if (!isset($_SESSION['intento_id']) || !isset($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Sesión no válida',
                'code' => 'SESSION_INVALID'
            ]);
            exit;
        }
        
        return [
            'intento_id' => $_SESSION['intento_id'],
            'usuario_id' => $_SESSION['usuario_id']
        ];
    }
    
    /**
     * Validar sesión de administrador
     */
    public static function validarSesionAdmin() {
        self::iniciarSesion();
        
        if (!isset($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Acceso no autorizado',
                'code' => 'UNAUTHORIZED'
            ]);
            exit;
        }
        
        return true;
    }
    
    /**
     * Crear sesión de estudiante
     */
    public static function crearSesionEstudiante($usuarioId, $intentoId) {
        self::iniciarSesion();
        
        $_SESSION['usuario_id'] = $usuarioId;
        $_SESSION['intento_id'] = $intentoId;
        $_SESSION['tipo_usuario'] = 'estudiante';
        $_SESSION['inicio_sesion'] = time();
        
        // Regenerar ID de sesión por seguridad
        session_regenerate_id(true);
    }
    
    /**
     * Crear sesión de administrador
     */
    public static function crearSesionAdmin($username) {
        self::iniciarSesion();
        
        $_SESSION['admin_authenticated'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['tipo_usuario'] = 'admin';
        $_SESSION['inicio_sesion'] = time();
        
        session_regenerate_id(true);
    }
    
    /**
     * Destruir sesión
     */
    public static function destruirSesion() {
        self::iniciarSesion();
        
        $_SESSION = array();
        
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }
        
        session_destroy();
    }
    
    /**
     * Sanitizar entrada
     */
    public static function sanitizar($data) {
        if (is_array($data)) {
            return array_map([self::class, 'sanitizar'], $data);
        }
        
        return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Validar cédula (solo números)
     */
    public static function validarCedula($cedula) {
        return preg_match('/^\d+$/', $cedula);
    }
    
    /**
     * Generar token CSRF
     */
    public static function generarTokenCSRF() {
        self::iniciarSesion();
        
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        
        return $_SESSION['csrf_token'];
    }
    
    /**
     * Validar token CSRF
     */
    public static function validarTokenCSRF($token) {
        self::iniciarSesion();
        
        if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Token CSRF inválido',
                'code' => 'CSRF_INVALID'
            ]);
            exit;
        }
        
        return true;
    }
    
    /**
     * Rate limiting simple (prevenir spam)
     */
    public static function verificarRateLimit($accion, $limite = 10, $ventana = 60) {
        self::iniciarSesion();
        
        $clave = 'rate_limit_' . $accion;
        $ahora = time();
        
        if (!isset($_SESSION[$clave])) {
            $_SESSION[$clave] = ['count' => 1, 'inicio' => $ahora];
            return true;
        }
        
        $data = $_SESSION[$clave];
        
        // Resetear si pasó la ventana de tiempo
        if ($ahora - $data['inicio'] > $ventana) {
            $_SESSION[$clave] = ['count' => 1, 'inicio' => $ahora];
            return true;
        }
        
        // Incrementar contador
        $_SESSION[$clave]['count']++;
        
        // Verificar límite
        if ($_SESSION[$clave]['count'] > $limite) {
            http_response_code(429);
            echo json_encode([
                'success' => false,
                'message' => 'Demasiadas solicitudes. Intente más tarde.',
                'code' => 'RATE_LIMIT_EXCEEDED'
            ]);
            exit;
        }
        
        return true;
    }
    
    /**
     * Validar que el intento pertenece al usuario
     */
    public static function validarPropiedadIntento($intentoId, $usuarioId) {
        require_once __DIR__ . '/Database.php';
        
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT usuario_id FROM intentos_examen WHERE id = ?");
        $stmt->execute([$intentoId]);
        $resultado = $stmt->fetch();
        
        if (!$resultado || $resultado['usuario_id'] != $usuarioId) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Acceso denegado',
                'code' => 'ACCESS_DENIED'
            ]);
            exit;
        }
        
        return true;
    }
    
    /**
     * Log de seguridad
     */
    public static function log($mensaje, $nivel = 'INFO') {
        $fecha = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
        $logMsg = "[$fecha] [$nivel] [IP: $ip] $mensaje\n";
        
        error_log($logMsg, 3, __DIR__ . '/../../logs/security.log');
    }
}
