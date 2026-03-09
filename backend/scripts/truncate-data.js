/**
 * Script para limpiar datos del sistema
 * Uso: node scripts/truncate-data.js [opcion]
 * 
 * Opciones:
 *   --keep-users    : Limpia exámenes pero mantiene TODOS los usuarios
 *   --keep-admins   : Limpia todo excepto administradores
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import db from '../src/infrastructure/database/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const option = args[0];

async function executeSQLFile(filePath) {
    try {
        const sql = readFileSync(filePath, 'utf8');
        
        // Dividir por punto y coma y ejecutar cada statement
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`\n📄 Ejecutando: ${filePath}\n`);

        for (const statement of statements) {
            if (statement.toUpperCase().startsWith('SELECT')) {
                const [rows] = await db.query(statement);
                console.table(rows);
            } else {
                await db.query(statement);
                console.log('✓ Statement ejecutado');
            }
        }

        console.log('\n✅ Script completado exitosamente\n');
    } catch (error) {
        console.error('❌ Error ejecutando script:', error.message);
        process.exit(1);
    }
}

async function main() {
    console.log('\n🗑️  Script de Limpieza de Datos\n');

    let sqlFile;

    switch (option) {
        case '--keep-users':
            sqlFile = join(__dirname, '../database/truncate_except_users.sql');
            console.log('Opción: Limpiar exámenes, mantener TODOS los usuarios');
            break;
        
        case '--keep-admins':
            sqlFile = join(__dirname, '../database/reset_keep_admins.sql');
            console.log('Opción: Limpiar TODO excepto administradores');
            console.log('⚠️  ADVERTENCIA: Esto eliminará todos los usuarios estudiantes\n');
            break;
        
        default:
            console.log('Uso: node scripts/truncate-data.js [opcion]\n');
            console.log('Opciones disponibles:');
            console.log('  --keep-users    : Limpia exámenes pero mantiene TODOS los usuarios');
            console.log('  --keep-admins   : Limpia todo excepto administradores\n');
            process.exit(0);
    }

    await executeSQLFile(sqlFile);
    process.exit(0);
}

main().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
});
