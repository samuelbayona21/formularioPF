/**
 * Mapper: Respuesta
 */
import { Respuesta } from '../../domain/entities/Respuesta.js';

export class RespuestaMapper {
    static toDomain(dbRow) {
        if (!dbRow) return null;
        
        return new Respuesta({
            id: dbRow.id,
            intentoId: dbRow.intento_id,
            preguntaId: dbRow.pregunta_id,
            respuestaSeleccionada: dbRow.respuesta_seleccionada,
            esCorrecta: dbRow.es_correcta === 1,
            fechaRespuesta: dbRow.fecha_respuesta
        });
    }

    static toPersistence(respuesta) {
        return {
            intento_id: respuesta.intentoId,
            pregunta_id: respuesta.preguntaId,
            respuesta_seleccionada: respuesta.respuestaSeleccionada,
            es_correcta: respuesta.esCorrecta ? 1 : 0
        };
    }
}
