/**
 * Script para agregar opciones E, F, G a todas las preguntas
 * Uso: node scripts/add-extra-options.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import db from '../src/infrastructure/database/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function addExtraOptions() {
    try {
        console.log('\n📝 Agregando opciones E, F, G a todas las preguntas...\n');

        // Leer el archivo SQL
        const sqlFile = join(__dirname, '../database/add_extra_options.sql');
        const sql = readFileSync(sqlFile, 'utf8');

        // Dividir por punto y coma y ejecutar cada statement
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('USE'));

        for (const statement of statements) {
            if (statement.toUpperCase().startsWith('SELECT')) {
                const [rows] = await db.query(statement);
                console.table(rows);
            } else if (statement.toUpperCase().startsWith('INSERT')) {
                const [result] = await db.query(statement);
                console.log(`✓ Insertadas ${result.affectedRows} opciones`);
            } else {
                await db.query(statement);
            }
        }

        console.log('\n✅ Opciones agregadas exitosamente\n');
        console.log('Opciones agregadas:');
        console.log('  E: Solo A y B');
        console.log('  F: Solo C y D');
        console.log('  G: Todas las anteriores\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addExtraOptions();
