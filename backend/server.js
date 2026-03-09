/**
 * Server Principal
 * Punto de entrada de la aplicación con Clean Architecture
 */
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import corsMiddleware from './src/presentation/middleware/cors.middleware.js';
import { createApiRoutes } from './src/presentation/routes/api.routes.js';
import container from './src/infrastructure/config/container.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en producción con HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'lax' // lax para mismo dominio
    }
}));

// Obtener controladores del container
const examenController = container.get('examenController');
const adminController = container.get('adminController');

// Rutas API
app.use('/api', createApiRoutes(examenController, adminController));

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
    const frontendPath = join(__dirname, '..', 'frontend-react', 'dist');
    app.use(express.static(frontendPath));
    
    // Todas las rutas no-API deben servir el index.html (para React Router)
    app.get('*', (req, res) => {
        res.sendFile(join(frontendPath, 'index.html'));
    });
} else {
    // Ruta raíz en desarrollo - Documentación API
    app.get('/', (req, res) => {
        res.json({
            message: 'API de Exámenes GAF - Clean Architecture',
            version: '2.0.0',
            architecture: 'Clean Architecture',
            layers: {
                domain: 'Entities + Use Cases + Repository Interfaces',
                application: 'DTOs + Mappers',
                infrastructure: 'Database + Repository Implementations',
                presentation: 'Controllers + Routes + Middleware'
            },
            endpoints: {
                health: 'GET /api/health',
                auth: {
                    login: 'POST /api/auth/login'
                },
                examen: {
                    preguntas: 'GET /api/examen/preguntas',
                    respuesta: 'POST /api/examen/respuesta',
                    tiempo: 'GET/POST /api/examen/tiempo',
                    finalizar: 'POST /api/examen/finalizar'
                },
                admin: {
                    login: 'POST /api/admin/login',
                    logout: 'POST /api/admin/logout',
                    resultados: 'GET /api/admin/resultados',
                    estadisticas: 'GET /api/admin/estadisticas',
                    detalle: 'GET /api/admin/resultado/:intentoId'
                }
            }
        });
    });
}

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log('  🚀 SERVIDOR INICIADO');
    console.log('========================================');
    console.log(`  Puerto: ${PORT}`);
    console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Arquitectura: Clean Architecture`);
    console.log(`  Capas:`);
    console.log(`    - Domain (Entities + Use Cases)`);
    console.log(`    - Application (DTOs + Mappers)`);
    console.log(`    - Infrastructure (Repositories)`);
    console.log(`    - Presentation (Controllers)`);
    console.log('========================================');
});
