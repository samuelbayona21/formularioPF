/**
 * Caso de Uso: Obtener Tiempo Transcurrido
 */
export class ObtenerTiempoUseCase {
    constructor(examenRepository) {
        this.examenRepository = examenRepository;
    }

    async execute(intentoId) {
        if (!intentoId) {
            throw new Error('ID de intento requerido');
        }

        const intento = await this.examenRepository.getIntento(intentoId);
        
        if (!intento) {
            throw new Error('Intento no encontrado');
        }

        return {
            tiempo_transcurrido: intento.tiempo_segundos || 0
        };
    }
}
