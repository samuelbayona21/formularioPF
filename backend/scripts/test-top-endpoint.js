/**
 * Script: Probar endpoint de Top Resultados
 * Uso: node backend/scripts/test-top-endpoint.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

async function testTopEndpoint() {
    let connection;
    
    try {
        console.log('🔌 Conectando a la base de datos...');
        
        const config = {
            host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
            user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
            database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'examen_gaf'
        };

        connection = await mysql.createConnection(config);
        console.log('✅ Conectado\n');

        // Ejecutar la misma query que el endpoint
        console.log('📊 Ejecutando query del Top 5...\n');
        const [rows] = await connection.query(`
            SELECT 
                u.nombre_completo,
                u.cedula,
                r.porcentaje,
                r.respuestas_correctas,
                e.total_preguntas,
                ie.tiempo_segundos,
                ie.fecha_fin,
                ie.id as intento_id
            FROM usuarios u
            INNER JOIN intentos_examen ie ON u.id = ie.usuario_id
            INNER JOIN resultados r ON ie.id = r.intento_id
            INNER JOIN examenes e ON ie.examen_id = e.id
            WHERE u.tipo_usuario = 'estudiante' 
            AND ie.estado = 'finalizado'
            ORDER BY r.porcentaje DESC, ie.tiempo_segundos ASC
            LIMIT 5
        `);

        if (rows.length === 0) {
            console.log('❌ No se encontraron resultados');
            console.log('\n🔍 Verificando datos en las tablas...\n');
            
            // Verificar usuarios
            const [usuarios] = await connection.query(
                "SELECT COUNT(*) as total FROM usuarios WHERE tipo_usuario = 'estudiante'"
            );
            console.log(`👥 Usuarios estudiantes: ${usuarios[0].total}`);
            
            // Verificar intentos
            const [intentos] = await connection.query(
                "SELECT COUNT(*) as total FROM intentos_examen WHERE estado = 'finalizado'"
            );
            console.log(`📝 Intentos finalizados: ${intentos[0].total}`);
            
            // Verificar resultados
            const [resultados] = await connection.query(
                'SELECT COUNT(*) as total FROM resultados'
            );
            console.log(`📊 Resultados: ${resultados[0].total}`);
            
            return;
        }

        console.log('✅ Resultados encontrados:', rows.length);
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('🏆 TOP 5 RESULTADOS');
        console.log('═══════════════════════════════════════════════════════');
        
        rows.forEach((row, index) => {
            const mins = Math.floor(row.tiempo_segundos / 60);
            const secs = row.tiempo_segundos % 60;
            const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}️⃣`;
            
            console.log(`${emoji} ${row.nombre_completo}`);
            console.log(`   Porcentaje: ${row.porcentaje}%`);
            console.log(`   Correctas: ${row.respuestas_correctas}/${row.total_preguntas}`);
            console.log(`   Tiempo: ${mins}m ${secs}s`);
            console.log(`   Intento ID: ${row.intento_id}`);
            console.log('');
        });
        
        console.log('═══════════════════════════════════════════════════════');
        console.log('\n✅ El endpoint debería devolver estos datos');
        console.log('🔍 Si no aparecen en el frontend, verifica:');
        console.log('   1. Que el backend esté desplegado con los cambios');
        console.log('   2. La consola del navegador para ver errores');
        console.log('   3. El Network tab para ver la respuesta del endpoint');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexión cerrada');
        }
    }
}

testTopEndpoint();