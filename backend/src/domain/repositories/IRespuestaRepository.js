/**
 * Interface: Repositorio de Respuesta
 */
export class IRespuestaRepository {
    async findByIntentoAndPregunta(intentoId, preguntaId) {
        throw new Error('Method not implemented');
    }

    async create(respuesta) {
        throw new Error('Method not implemented');
    }

    async update(id, respuesta) {
        throw new Error('Method not implemented');
    }

    async countByIntento(intentoId) {
        throw new Error('Method not implemented');
    }

    async getRespuestaCorrecta(preguntaId) {
        throw new Error('Method not implemented');
    }
}
