import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Railway proporciona MYSQL* y localmente usamos DB_*
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'examen_contabilidad',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
});

// Log de conexión (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
    console.log('📊 Configuración de Base de Datos:');
    console.log(`   Host: ${process.env.MYSQLHOST || process.env.DB_HOST || 'localhost'}`);
    console.log(`   Database: ${process.env.MYSQLDATABASE || process.env.DB_NAME || 'examen_contabilidad'}`);
    console.log(`   Port: ${process.env.MYSQLPORT || process.env.DB_PORT || '3306'}`);
}

export default pool;
