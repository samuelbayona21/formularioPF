/**
 * Implementación: Repositorio de Usuario en MySQL
 * Implementa la interface IUsuarioRepository
 */
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository.js';
import { UsuarioMapper } from '../../application/mappers/UsuarioMapper.js';
import db from '../database/mysql.js';

export class MySQLUsuarioRepository extends IUsuarioRepository {
    async findByCedula(cedula) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE cedula = ?', [cedula]);
        return UsuarioMapper.toDomain(rows[0]);
    }

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return UsuarioMapper.toDomain(rows[0]);
    }

    async create(usuario) {
        const data = UsuarioMapper.toPersistence(usuario);
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre_completo, cedula, tipo_usuario) VALUES (?, ?, ?)',
            [data.nombre_completo, data.cedula, data.tipo_usuario]
        );
        return result.insertId;
    }

    async update(id, usuario) {
        const data = UsuarioMapper.toPersistence(usuario);
        await db.query(
            'UPDATE usuarios SET nombre_completo = ?, tipo_usuario = ? WHERE id = ?',
            [data.nombre_completo, data.tipo_usuario, id]
        );
    }

    async delete(id) {
        await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    }

    async getAllResultados(filtros = {}) {
        let query = `
            SELECT 
                u.id,
                u.nombre_completo,
                u.cedula,
                ie.id as intento_id,
                r.calificacion,
                e.total_preguntas,
                r.respuestas_correctas,
                r.porcentaje,
                ie.estado,
                ie.tiempo_segundos,
                ie.fecha_inicio,
                ie.fecha_fin
            FROM usuarios u
            INNER JOIN intentos_examen ie ON u.id = ie.usuario_id
            LEFT JOIN resultados r ON ie.id = r.intento_id
            LEFT JOIN examenes e ON ie.examen_id = e.id
            WHERE u.tipo_usuario = 'estudiante'
        `;

        const params = [];
        const conditions = [];

        if (filtros.estado && filtros.estado.trim() !== '') {
            conditions.push('ie.estado = ?');
            params.push(filtros.estado);
        }

        if (filtros.cedula && filtros.cedula.trim() !== '') {
            conditions.push('u.cedula LIKE ?');
            params.push(`%${filtros.cedula.trim()}%`);
        }

        if (filtros.nombre && filtros.nombre.trim() !== '') {
            conditions.push('LOWER(u.nombre_completo) LIKE LOWER(?)');
            params.push(`%${filtros.nombre.trim()}%`);
        }

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        query += ' ORDER BY ie.fecha_inicio DESC';

        const [rows] = await db.query(query, params);
        return rows;
    }

    async getEstadisticas() {
        const [rows] = await db.query(`
            SELECT 
                COUNT(DISTINCT u.id) as total_usuarios,
                COUNT(DISTINCT ie.id) as total_examenes,
                SUM(CASE WHEN ie.estado = 'completado' THEN 1 ELSE 0 END) as examenes_completados,
                SUM(CASE WHEN ie.estado = 'en_progreso' THEN 1 ELSE 0 END) as examenes_en_progreso,
                AVG(r.calificacion) as promedio_calificacion,
                (SUM(CASE WHEN r.calificacion >= 3.0 THEN 1 ELSE 0 END) / COUNT(r.id) * 100) as tasa_aprobacion
            FROM usuarios u
            LEFT JOIN intentos_examen ie ON u.id = ie.usuario_id
            LEFT JOIN resultados r ON ie.id = r.intento_id
            WHERE u.tipo_usuario = 'estudiante'
        `);
        return rows[0] || {};
    }

    async getTopResultados(limit = 5) {
        const [rows] = await db.query(`
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
            AND ie.estado IN ('completado', 'finalizado')
            ORDER BY r.porcentaje DESC, ie.tiempo_segundos ASC
            LIMIT ?
        `, [limit]);
        return rows;
    }

    async getDetalleResultado(intentoId) {
        // Obtener información del intento y usuario
        const [intentoRows] = await db.query(`
            SELECT 
                u.nombre_completo,
                u.cedula,
                ie.id as intento_id,
                r.calificacion,
                e.total_preguntas,
                r.respuestas_correctas,
                r.porcentaje,
                ie.estado,
                ie.tiempo_segundos,
                ie.fecha_inicio,
                ie.fecha_fin
            FROM intentos_examen ie
            JOIN usuarios u ON ie.usuario_id = u.id
            JOIN examenes e ON ie.examen_id = e.id
            LEFT JOIN resultados r ON ie.id = r.intento_id
            WHERE ie.id = ?
        `, [intentoId]);

        if (intentoRows.length === 0) {
            return null;
        }

        // Obtener respuestas del usuario con el texto de las opciones
        const [respuestasRows] = await db.query(`
            SELECT 
                p.numero_pregunta,
                p.texto_pregunta,
                re.respuesta_seleccionada as respuesta_usuario,
                p.respuesta_correcta,
                re.es_correcta,
                (SELECT texto_opcion FROM opciones 
                 WHERE pregunta_id = p.id 
                 AND letra_opcion = re.respuesta_seleccionada 
                 LIMIT 1) as texto_respuesta_usuario,
                (SELECT texto_opcion FROM opciones 
                 WHERE pregunta_id = p.id 
                 AND letra_opcion = p.respuesta_correcta 
                 LIMIT 1) as texto_respuesta_correcta
            FROM respuestas_estudiante re
            JOIN preguntas p ON re.pregunta_id = p.id
            WHERE re.intento_id = ?
            ORDER BY p.numero_pregunta
        `, [intentoId]);

        return {
            ...intentoRows[0],
            respuestas: respuestasRows
        };
    }

    async validatePassword(cedula, password) {
        const [rows] = await db.query(
            'SELECT password FROM usuarios WHERE cedula = ? AND tipo_usuario = "administrador"',
            [cedula]
        );

        if (rows.length === 0) {
            return false;
        }

        // Por ahora comparación simple, en producción usar bcrypt
        return rows[0].password === password;
    }
}
