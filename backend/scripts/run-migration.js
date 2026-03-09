/**
 * Script para ejecutar la migración de la base de datos
 */
import db from '../src/infrastructure/database/mysql.js';

async function runMigration() {
    try {
        console.log('🔄 Ejecutando migración...\n');

        // 1. Agregar campo password
        try {
            await db.query('ALTER TABLE usuarios ADD COLUMN password VARCHAR(255) NULL AFTER cedula');
            console.log('✅ Campo password agregado');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️  Campo password ya existe');
            } else {
                throw err;
            }
        }

        // 2. Agregar campo tiempo_segundos
        try {
            await db.query('ALTER TABLE intentos_examen ADD COLUMN tiempo_segundos INT DEFAULT 0 AFTER tiempo_restante');
            console.log('✅ Campo tiempo_segundos agregado');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️  Campo tiempo_segundos ya existe');
            } else {
                throw err;
            }
        }

        // 3. Agregar campo calificacion
        try {
            await db.query('ALTER TABLE resultados ADD COLUMN calificacion DECIMAL(3,2) DEFAULT 0.00 AFTER porcentaje');
            console.log('✅ Campo calificacion agregado');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️  Campo calificacion ya existe');
            } else {
                throw err;
            }
        }

        // 4. Actualizar contraseñas de administradores
        await db.query("UPDATE usuarios SET password = 'admin123' WHERE cedula = 'admin' AND (password IS NULL OR password = '')");
        await db.query("UPDATE usuarios SET password = 'oscar2026' WHERE cedula = 'oscar2026' AND (password IS NULL OR password = '')");
        console.log('✅ Contraseñas de administradores actualizadas');

        // 5. Crear índice
        try {
            await db.query('CREATE INDEX idx_tipo_usuario ON usuarios(tipo_usuario)');
            console.log('✅ Índice idx_tipo_usuario creado');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                console.log('⚠️  Índice idx_tipo_usuario ya existe');
            } else {
                throw err;
            }
        }

        console.log('\n✅ Migración completada exitosamente');
        
        // Verificar cambios
        console.log('\n🔍 Verificando cambios...');
        const [columns] = await db.query('DESCRIBE usuarios');
        const hasPassword = columns.some(col => col.Field === 'password');
        console.log('  - Campo password:', hasPassword ? '✅' : '❌');

        const [intentosColumns] = await db.query('DESCRIBE intentos_examen');
        const hasTiempoSegundos = intentosColumns.some(col => col.Field === 'tiempo_segundos');
        console.log('  - Campo tiempo_segundos:', hasTiempoSegundos ? '✅' : '❌');

        const [resultadosColumns] = await db.query('DESCRIBE resultados');
        const hasCalificacion = resultadosColumns.some(col => col.Field === 'calificacion');
        console.log('  - Campo calificacion:', hasCalificacion ? '✅' : '❌');

        // Verificar contraseñas
        const [admins] = await db.query("SELECT cedula, password FROM usuarios WHERE tipo_usuario = 'administrador'");
        console.log('\n🔐 Administradores:');
        admins.forEach(admin => {
            console.log(`  - ${admin.cedula}: ${admin.password ? '✅ Contraseña configurada' : '❌ Sin contraseña'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en migración:', error.message);
        process.exit(1);
    }
}

runMigration();
