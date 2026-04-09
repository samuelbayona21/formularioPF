/**
 * Script: Insertar usuarios de prueba para Top 5
 * Uso: node backend/scripts/insert-test-users.js
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

async function insertTestUsers() {
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
        const sqlPath = join(__dirname, '../database/insert_test_users.sql');
        const sql = readFileSync(sqlPath, 'utf8');

        console.log('📝 Insertando usuarios de prueba...\n');

        // Ejecutar el script
        await connection.query(sql);

        console.log('✅ Usuarios de prueba insertados exitosamente!\n');
        console.log('═══════════════════════════════════════════════════════');
        console.log('🏆 TOP 5 USUARIOS DE PRUEBA CREADOS');
        console.log('═══════════════════════════════════════════════════════');
        console.log('🥇 1. María García    - 96% (48/50) - 18m 30s - Excelente');
        console.log('🥈 2. Carlos López    - 88% (44/50) - 22m 15s - Muy Bueno');
        console.log('🥉 3. Ana Rodríguez   - 76% (38/50) - 25m 45s - Bueno');
        console.log('4️⃣  4. Pedro Martínez - 62% (31/50) - 25m 20s - Aprobado');
        console.log('5️⃣  5. Laura Sánchez  - 48% (24/50) - 24m 10s - Reprobado');
        console.log('═══════════════════════════════════════════════════════');
        console.log('\n🎯 Ahora puedes:');
        console.log('   • Entrar al dashboard admin');
        console.log('   • Ver el Top 5 Mejores Resultados');
        console.log('   • Hacer click en cualquier resultado para ver detalles');
        console.log('   • Probar filtros y búsquedas');
        console.log('\n🚀 El Top 5 debería mostrar medallas y efectos RGB!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexión cerrada');
        }
    }
}

// Ejecutar
insertTestUsers();