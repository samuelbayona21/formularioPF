/**
 * Controller: Admin
 * Maneja las peticiones HTTP del panel administrativo
 */
export class AdminController {
    constructor(loginAdminUseCase, obtenerResultadosUseCase, obtenerEstadisticasUseCase, obtenerDetalleResultadoUseCase) {
        this.loginAdminUseCase = loginAdminUseCase;
        this.obtenerResultadosUseCase = obtenerResultadosUseCase;
        this.obtenerEstadisticasUseCase = obtenerEstadisticasUseCase;
        this.obtenerDetalleResultadoUseCase = obtenerDetalleResultadoUseCase;
    }

    async login(req, res) {
        try {
            const { cedula, password } = req.body;

            if (!cedula || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Usuario y contraseña requeridos'
                });
            }

            const resultado = await this.loginAdminUseCase.execute(cedula, password);

            // Guardar en sesión
            req.session.adminId = resultado.usuarioId;
            req.session.adminNombre = resultado.nombreCompleto;
            req.session.adminAuthenticated = true;

            res.json({
                success: true,
                message: 'Login exitoso',
                data: resultado
            });
        } catch (error) {
            console.error('Error en login admin:', error);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    async logout(req, res) {
        try {
            req.session.destroy();
            res.json({
                success: true,
                message: 'Sesión cerrada'
            });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({
                success: false,
                message: 'Error al cerrar sesión'
            });
        }
    }

    async getResultados(req, res) {
        try {
            const filtros = {
                estado: req.query.estado,
                cedula: req.query.cedula,
                nombre: req.query.nombre
            };

            const resultados = await this.obtenerResultadosUseCase.execute(filtros);

            res.json({
                success: true,
                resultados
            });
        } catch (error) {
            console.error('Error en getResultados:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener resultados'
            });
        }
    }

    async getEstadisticas(req, res) {
        try {
            const estadisticas = await this.obtenerEstadisticasUseCase.execute();

            res.json({
                success: true,
                estadisticas
            });
        } catch (error) {
            console.error('Error en getEstadisticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas'
            });
        }
    }

    async getDetalleResultado(req, res) {
        try {
            const { intentoId } = req.params;

            const detalle = await this.obtenerDetalleResultadoUseCase.execute(intentoId);

            res.json({
                success: true,
                detalle
            });
        } catch (error) {
            console.error('Error en getDetalleResultado:', error);
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}
