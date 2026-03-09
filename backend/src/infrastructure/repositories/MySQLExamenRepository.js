/**
 * Implementación: Repositorio de Examen en MySQL
 */
import { IExamenRepository } from '../../domain/repositories/IExamenRepository.js';
import db from '../database/mysql.js';

export class MySQLExamenRepository extends IExamenRepository {
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM examenes WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async findIntentoEnProgreso(usuarioId) {
        const [rows] = await db.query(
            "SELECT id FROM intentos_examen WHERE usuario_id = ? AND estado = 'en_progreso'",
            [usuarioId]
        );
        return rows[0] || null;
    }

    async createIntento(usuarioId, examenId) {
        const [result] = await db.query(
            "INSERT INTO intentos_examen (usuario_id, examen_id, estado) VALUES (?, ?, 'en_progreso')",
            [usuarioId, examenId]
        );
        return result.insertId;
    }

    async getPreguntas(examenId) {
        const [rows] = await db.query(
            'SELECT * FROM preguntas WHERE examen_id = ? ORDER BY numero_pregunta',
            [examenId]
        );
        return rows;
    }

    async getOpciones(preguntaId) {
        const [rows] = await db.query(
            'SELECT id, letra_opcion, texto_opcion FROM opciones WHERE pregunta_id = ? ORDER BY letra_opcion',
            [preguntaId]
        );
        return rows;
    }

    async getIntento(intentoId) {
        const [rows] = await db.query(
            `SELECT ie.*, e.total_preguntas 
             FROM intentos_examen ie 
             JOIN examenes e ON ie.examen_id = e.id 
             WHERE ie.id = ?`,
            [intentoId]
        );
        return rows[0] || null;
    }

    async updateTiempo(intentoId, tiempoSegundos) {
        await db.query(
            'UPDATE intentos_examen SET tiempo_segundos = ? WHERE id = ?',
            [tiempoSegundos, intentoId]
        );
    }

    async finalizarIntento(intentoId, estado) {
        await db.query(
            'UPDATE intentos_examen SET fecha_fin = NOW(), estado = ? WHERE id = ?',
            [estado, intentoId]
        );
    }
}
