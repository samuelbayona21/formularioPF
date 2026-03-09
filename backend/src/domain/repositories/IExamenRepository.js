/**
 * Interface: Repositorio de Examen
 */
export class IExamenRepository {
    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findIntentoEnProgreso(usuarioId) {
        throw new Error('Method not implemented');
    }

    async createIntento(usuarioId, examenId) {
        throw new Error('Method not implemented');
    }

    async getPreguntas(examenId) {
        throw new Error('Method not implemented');
    }

    async getOpciones(preguntaId) {
        throw new Error('Method not implemented');
    }

    async getIntento(intentoId) {
        throw new Error('Method not implemented');
    }

    async updateTiempo(intentoId, tiempoSegundos) {
        throw new Error('Method not implemented');
    }

    async finalizarIntento(intentoId, estado) {
        throw new Error('Method not implemented');
    }
}
