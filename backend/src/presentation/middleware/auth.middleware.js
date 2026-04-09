/**
 * Middleware: Autenticación
 */
export const validateSession = (req, res, next) => {
    console.log('🔐 Validando sesión:', {
        sessionID: req.sessionID,
        session: req.session,
        intentoId: req.session?.intentoId,
        usuarioId: req.session?.usuarioId,
        cookies: req.headers.cookie
    });

    if (!req.session.intentoId || !req.session.usuarioId) {
        console.error('❌ Sesión no válida - faltan datos');
        return res.status(401).json({
            success: false,
            message: 'Sesión no válida. Por favor, inicia sesión nuevamente.'
        });
    }
    
    req.intentoId = req.session.intentoId;
    req.usuarioId = req.session.usuarioId;
    
    console.log('✅ Sesión válida:', { intentoId: req.intentoId, usuarioId: req.usuarioId });
    next();
};

export const validateAdmin = (req, res, next) => {
    console.log('🔐 Validando admin:', {
        sessionID: req.sessionID,
        adminAuthenticated: req.session?.adminAuthenticated,
        cookies: req.headers.cookie
    });

    if (!req.session.adminAuthenticated) {
        console.error('❌ Acceso denegado - no es admin');
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado: Se requieren permisos de administrador'
        });
    }
    
    req.adminId = req.session.adminId;
    req.adminNombre = req.session.adminNombre;
    
    console.log('✅ Admin válido:', { adminId: req.adminId });
    next();
};
