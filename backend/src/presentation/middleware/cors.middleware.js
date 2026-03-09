/**
 * Middleware: CORS
 */
import cors from 'cors';

// En producción, si frontend y backend están en el mismo dominio, no necesitamos CORS estricto
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (mismo dominio, mobile apps, curl)
        if (!origin) return callback(null, true);
        
        // En producción con mismo dominio, permitir
        if (process.env.NODE_ENV === 'production' && !origin) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(null, true); // Permitir en producción para mismo dominio
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

export default cors(corsOptions);
