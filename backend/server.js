/**
 * Server Principal
 * Punto de entrada de la aplicación con Clean Architecture
 */
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import corsMiddleware from './src/presentation/middleware/cors.middleware.js';
import { createApiRoutes } from './src/presentation/routes/api.routes.js';
import container from './src/infrastructure/config/container.js';

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
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Para CORS en producción
    }
}));

// Obtener controladores del container
const examenController = container.get('examenController');
const adminController = container.get('adminController');

// Rutas
app.use('/api', createApiRoutes(examenController, adminController));

// Ruta raíz
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
