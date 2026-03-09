/**
 * Implementación: Repositorio de Respuesta en MySQL
 */
import { IRespuestaRepository } from '../../domain/repositories/IRespuestaRepository.js';
import { RespuestaMapper } from '../../application/mappers/RespuestaMapper.js';
import db from '../database/mysql.js';

export class MySQLRespuestaRepository extends IRespuestaRepository {
    async findByIntentoAndPregunta(intentoId, preguntaId) {
        const [rows] = await db.query(
            'SELECT * FROM respuestas_estudiante WHERE intento_id = ? AND pregunta_id = ?',
            [intentoId, preguntaId]
        );
        return RespuestaMapper.toDomain(rows[0]);
    }

    async create(respuesta) {
        const data = RespuestaMapper.toPersistence(respuesta);
        await db.query(
            `INSERT INTO respuestas_estudiante (intento_id, pregunta_id, respuesta_seleccionada, es_correcta) 
             VALUES (?, ?, ?, ?)`,
            [data.intento_id, data.pregunta_id, data.respuesta_seleccionada, data.es_correcta]
        );
    }

    async update(id, respuesta) {
        const data = RespuestaMapper.toPersistence(respuesta);
        await db.query(
            `UPDATE respuestas_estudiante 
             SET respuesta_seleccionada = ?, es_correcta = ? 
             WHERE id = ?`,
            [data.respuesta_seleccionada, data.es_correcta, id]
        );
    }

    async countByIntento(intentoId) {
        const [rows] = await db.query(
            `SELECT 
                COUNT(*) as total_respondidas,
                SUM(CASE WHEN es_correcta = 1 THEN 1 ELSE 0 END) as correctas,
                SUM(CASE WHEN es_correcta = 0 THEN 1 ELSE 0 END) as incorrectas
             FROM respuestas_estudiante 
             WHERE intento_id = ?`,
            [intentoId]
        );
        return rows[0];
    }

    async getRespuestaCorrecta(preguntaId) {
        const [rows] = await db.query(
            'SELECT respuesta_correcta FROM preguntas WHERE id = ?',
            [preguntaId]
        );
        return rows[0]?.respuesta_correcta || null;
    }

    async saveResultado(resultado) {
        // Verificar si ya existe un resultado para este intento
        const [existing] = await db.query(
            'SELECT id FROM resultados WHERE intento_id = ?',
            [resultado.intentoId]
        );

        if (existing.length > 0) {
            // Actualizar resultado existente
            await db.query(
                `UPDATE resultados 
                 SET total_preguntas = ?, 
                     respuestas_correctas = ?, 
                     respuestas_incorrectas = ?, 
                     porcentaje = ?,
                     calificacion = ?,
                     fecha_calculo = NOW()
                 WHERE intento_id = ?`,
                [
                    resultado.totalPreguntas,
                    resultado.respuestasCorrectas,
                    resultado.respuestasIncorrectas,
                    resultado.porcentaje,
                    resultado.calificacion,
                    resultado.intentoId
                ]
            );
        } else {
            // Insertar nuevo resultado
            await db.query(
                `INSERT INTO resultados 
                 (intento_id, total_preguntas, respuestas_correctas, respuestas_incorrectas, porcentaje, calificacion) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    resultado.intentoId,
                    resultado.totalPreguntas,
                    resultado.respuestasCorrectas,
                    resultado.respuestasIncorrectas,
                    resultado.porcentaje,
                    resultado.calificacion
                ]
            );
        }
    }
}
