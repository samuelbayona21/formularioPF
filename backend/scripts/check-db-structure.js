/**
 * Script para verificar la estructura de la base de datos
 */
import db from '../src/infrastructure/database/mysql.js';

async function checkDatabaseStructure() {
    try {
        console.log('🔍 Verificando estructura de la base de datos...\n');

        // Verificar tablas
        const [tables] = await db.query('SHOW TABLES');
        console.log('📋 Tablas encontradas:');
        tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });

        // Verificar estructura de usuarios
        console.log('\n👤 Estructura de tabla usuarios:');
        const [usuariosColumns] = await db.query('DESCRIBE usuarios');
        usuariosColumns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
        });

        // Verificar usuarios administradores
        console.log('\n🔐 Usuarios administradores:');
        const [admins] = await db.query("SELECT id, nombre_completo, cedula, tipo_usuario FROM usuarios WHERE tipo_usuario = 'administrador'");
        admins.forEach(admin => {
            console.log(`  - ${admin.nombre_completo} (${admin.cedula})`);
        });

        // Verificar estructura de intentos_examen
        console.log('\n📝 Estructura de tabla intentos_examen:');
        const [intentosColumns] = await db.query('DESCRIBE intentos_examen');
        intentosColumns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });

        // Verificar estructura de respuestas
        console.log('\n✍️ Tablas de respuestas:');
        const [respuestasTables] = await db.query("SHOW TABLES LIKE '%respuesta%'");
        respuestasTables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });

        // Verificar estructura de resultados
        console.log('\n📊 Estructura de tabla resultados:');
        const [resultadosColumns] = await db.query('DESCRIBE resultados');
        resultadosColumns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });

        console.log('\n✅ Verificación completada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkDatabaseStructure();
