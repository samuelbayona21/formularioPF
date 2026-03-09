/**
 * Middleware: Autenticación
 */
export const validateSession = (req, res, next) => {
    if (!req.session.intentoId || !req.session.usuarioId) {
        return res.status(401).json({
            success: false,
            message: 'Sesión no válida'
        });
    }
    
    req.intentoId = req.session.intentoId;
    req.usuarioId = req.session.usuarioId;
    
    next();
};

export const validateAdmin = (req, res, next) => {
    if (!req.session.adminAuthenticated) {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado: Se requieren permisos de administrador'
        });
    }
    
    req.adminId = req.session.adminId;
    req.adminNombre = req.session.adminNombre;
    next();
};
