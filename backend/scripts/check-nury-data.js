/**
 * Script: Verificar datos existentes de Nury Martinez
 * Uso: node backend/scripts/check-nury-data.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

async function checkNuryData() {
    let connection;
    
    try {
        console.log('🔌 Conectando a la base de datos...');
        
        // Configuración de conexión
        const config = {
            host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
            user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
            database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'examen_gaf'
        };

        connection = await mysql.createConnection(config);
        console.log('✅ Conectado a la base de datos\n');

        // Buscar usuario Nury
        console.log('👤 Buscando usuario Nury Martinez...');
        const [usuarios] = await connection.query(
            "SELECT * FROM usuarios WHERE nombre_completo LIKE '%Nury%' OR cedula = '51891837'"
        );
        
        if (usuarios.length === 0) {
            console.log('❌ No se encontró usuario Nury Martinez');
            return;
        }

        const usuario = usuarios[0];
        console.log('✅ Usuario encontrado:', {
            id: usuario.id,
            nombre: usuario.nombre_completo,
            cedula: usuario.cedula,
            tipo: usuario.tipo_usuario
        });

        // Buscar intentos del usuario
        console.log('\n📝 Buscando intentos de examen...');
        const [intentos] = await connection.query(
            'SELECT * FROM intentos_examen WHERE usuario_id = ?',
            [usuario.id]
        );

        if (intentos.length === 0) {
            console.log('❌ No se encontraron intentos para este usuario');
            return;
        }

        console.log('✅ Intentos encontrados:');
        intentos.forEach(intento => {
            console.log(`   - ID: ${intento.id}, Estado: ${intento.estado}, Fecha: ${intento.fecha_inicio}`);
        });

        // Buscar resultados
        console.log('\n📊 Buscando resultados...');
        for (const intento of intentos) {
            const [resultados] = await connection.query(
                'SELECT * FROM resultados WHERE intento_id = ?',
                [intento.id]
            );

            if (resultados.length > 0) {
                const resultado = resultados[0];
                console.log(`✅ Resultado para intento ${intento.id}:`, {
                    porcentaje: resultado.porcentaje,
                    correctas: resultado.respuestas_correctas,
                    total: resultado.total_preguntas
                });
            } else {
                console.log(`❌ No hay resultado para intento ${intento.id}`);
            }
        }

        // Contar respuestas
        console.log('\n💬 Contando respuestas por intento...');
        for (const intento of intentos) {
            const [respuestas] = await connection.query(
                'SELECT COUNT(*) as total FROM respuestas_estudiante WHERE intento_id = ?',
                [intento.id]
            );
            console.log(`   - Intento ${intento.id}: ${respuestas[0].total} respuestas`);
        }

        console.log('\n═══════════════════════════════════════');
        console.log('📋 RESUMEN PARA ACTUALIZACIÓN');
        console.log('═══════════════════════════════════════');
        console.log(`Usuario ID: ${usuario.id}`);
        console.log(`Intentos disponibles: ${intentos.map(i => i.id).join(', ')}`);
        console.log('Usar el intento más reciente para actualizar');
        console.log('═══════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexión cerrada');
        }
    }
}

// Ejecutar
checkNuryData();