/**
 * Routes: API
 * Define todas las rutas de la API
 */
import express from 'express';
import { validateSession, validateAdmin } from '../middleware/auth.middleware.js';

export function createApiRoutes(examenController, adminController) {
    const router = express.Router();

    // Health check
    router.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: Date.now() });
    });

    // Autenticación
    router.post('/auth/login', (req, res) => examenController.iniciar(req, res));

    // Examen (requieren autenticación)
    router.get('/examen/preguntas', validateSession, (req, res) => examenController.preguntas(req, res));
    router.post('/examen/respuesta', validateSession, (req, res) => examenController.guardarRespuesta(req, res));
    router.get('/examen/tiempo', validateSession, (req, res) => examenController.obtenerTiempo(req, res));
    router.post('/examen/tiempo', validateSession, (req, res) => examenController.guardarTiempo(req, res));
    router.post('/examen/finalizar', validateSession, (req, res) => examenController.finalizar(req, res));

    // Admin (requieren autenticación de administrador)
    router.post('/admin/login', (req, res) => adminController.login(req, res));
    router.post('/admin/logout', validateAdmin, (req, res) => adminController.logout(req, res));
    router.get('/admin/resultados', validateAdmin, (req, res) => adminController.getResultados(req, res));
    router.get('/admin/estadisticas', validateAdmin, (req, res) => adminController.getEstadisticas(req, res));
    router.get('/admin/top-resultados', validateAdmin, (req, res) => adminController.getTopResultados(req, res));
    router.get('/admin/resultado/:intentoId', validateAdmin, (req, res) => adminController.getDetalleResultado(req, res));

    return router;
}
