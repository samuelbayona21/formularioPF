/**
 * Caso de Uso: Obtener Preguntas del Examen
 */
export class ObtenerPreguntasUseCase {
    constructor(examenRepository) {
        this.examenRepository = examenRepository;
    }

    async execute(examenId = 1) {
        const preguntas = await this.examenRepository.getPreguntas(examenId);
        
        // Agregar opciones a cada pregunta
        for (let pregunta of preguntas) {
            pregunta.opciones = await this.examenRepository.getOpciones(pregunta.id);
        }
        
        return preguntas;
    }
}
