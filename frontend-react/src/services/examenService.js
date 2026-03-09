/**
 * Examen Service - Operaciones del examen
 */
import api from './api';

export const examenService = {
    async obtenerPreguntas() {
        const response = await api.get('/examen/preguntas');
        return response.data.preguntas;
    },

    async guardarRespuesta(preguntaId, respuesta) {
        const response = await api.post('/examen/respuesta', {
            pregunta_id: preguntaId,
            respuesta: respuesta
        });
        return response.data;
    },

    async obtenerTiempo() {
        const response = await api.get('/examen/tiempo');
        return response.data.tiempo_transcurrido || 0;
    },

    async guardarTiempo(tiempoSegundos) {
        await api.post('/examen/tiempo', {
            tiempo_segundos: tiempoSegundos
        });
    },

    async finalizarExamen(tiempoAgotado = false) {
        const response = await api.post('/examen/finalizar', {
            tiempo_agotado: tiempoAgotado
        });
        return response.data.resultado;
    }
};
