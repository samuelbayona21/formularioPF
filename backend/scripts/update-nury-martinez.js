/**
 * Script: Actualizar usuario Nury Martinez (ID 20) con examen completado
 * Uso: node backend/scripts/update-nury-martinez.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

async function updateNuryMartinez() {
    let connection;
    
    try {
        console.log('🔌 Conectando a la base de datos...');
        
        // Configuración de conexión
        const config = {
            host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
            user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
            database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'examen_gaf',
            multipleStatements: true
        };

        console.log('📊 Configuración:', {
            host: config.host,
            port: config.port,
            user: config.user,
            database: config.database
        });

        connection = await mysql.createConnection(config);
        console.log('✅ Conectado a la base de datos\n');

        // Leer el archivo SQL
        const sqlPath = join(__dirname, '../database/update_nury_martinez.sql');
        const sql = readFileSync(sqlPath, 'utf8');

        console.log('📝 Ejecutando script de actualización...\n');

        // Ejecutar el script
        await connection.query(sql);

        console.log('✅ Usuario actualizado exitosamente!\n');
        console.log('═══════════════════════════════════════');
        console.log('📊 RESUMEN DE ACTUALIZACIÓN');
        console.log('═══════════════════════════════════════');
        console.log('Usuario ID: 20 - Nury Martinez');
        console.log('Cédula: 51891837');
        console.log('Intento ID: 4 - Actualizado');
        console.log('Total preguntas: 50');
        console.log('Correctas: 34');
        console.log('Incorrectas: 16');
        console.log('Porcentaje: 68.00%');
        console.log('Calificación: 3.40/5.00');
        console.log('Tiempo: 21m 11s');
        console.log('Estado: ✅ Aprobado');
        console.log('═══════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar
updateNuryMartinez();