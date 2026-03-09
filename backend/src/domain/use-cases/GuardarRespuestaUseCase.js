/**
 * Caso de Uso: Guardar Respuesta del Estudiante
 */
import { Respuesta } from '../entities/Respuesta.js';

export class GuardarRespuestaUseCase {
    constructor(respuestaRepository) {
        this.respuestaRepository = respuestaRepository;
    }

    async execute(intentoId, preguntaId, respuestaSeleccionada) {
        // Validar entrada
        if (!intentoId || !preguntaId || !respuestaSeleccionada) {
            throw new Error('Datos incompletos');
        }

        // Obtener respuesta correcta
        const respuestaCorrecta = await this.respuestaRepository.getRespuestaCorrecta(preguntaId);
        
        if (!respuestaCorrecta) {
            throw new Error('Pregunta no encontrada');
        }

        // Verificar si es correcta
        const esCorrecta = respuestaSeleccionada === respuestaCorrecta;

        // Buscar si ya existe una respuesta
        const respuestaExistente = await this.respuestaRepository.findByIntentoAndPregunta(
            intentoId,
            preguntaId
        );

        if (respuestaExistente) {
            // Actualizar respuesta existente
            respuestaExistente.actualizar(respuestaSeleccionada, esCorrecta);
            await this.respuestaRepository.update(respuestaExistente.id, respuestaExistente);
        } else {
            // Crear nueva respuesta
            const nuevaRespuesta = new Respuesta({
                intentoId,
                preguntaId,
                respuestaSeleccionada,
                esCorrecta
            });
            await this.respuestaRepository.create(nuevaRespuesta);
        }

        return { success: true };
    }
}
