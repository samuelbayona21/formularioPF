/**
 * Caso de Uso: Guardar Tiempo del Examen
 */
export class GuardarTiempoUseCase {
    constructor(examenRepository) {
        this.examenRepository = examenRepository;
    }

    async execute(intentoId, tiempoSegundos) {
        if (!intentoId || tiempoSegundos === undefined || tiempoSegundos === null) {
            throw new Error('Datos incompletos');
        }

        await this.examenRepository.updateTiempo(intentoId, tiempoSegundos);
        return { success: true };
    }
}
