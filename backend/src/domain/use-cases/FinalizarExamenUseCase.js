/**
 * Caso de Uso: Finalizar Examen
 */
import { Resultado } from '../entities/Resultado.js';

export class FinalizarExamenUseCase {
    constructor(examenRepository, respuestaRepository) {
        this.examenRepository = examenRepository;
        this.respuestaRepository = respuestaRepository;
    }

    async execute(intentoId, tiempoAgotado = false) {
        // Obtener datos del intento
        const intento = await this.examenRepository.getIntento(intentoId);
        
        if (!intento) {
            throw new Error('Intento no encontrado');
        }

        // Contar respuestas
        const conteo = await this.respuestaRepository.countByIntento(intentoId);
        
        // Crear entidad de resultado
        const resultado = new Resultado({
            intentoId,
            totalPreguntas: intento.total_preguntas,
            respuestasCorrectas: parseInt(conteo.correctas) || 0,
            respuestasIncorrectas: parseInt(conteo.incorrectas) || 0
        });

        const porcentaje = resultado.calcularPorcentaje();
        const calificacion = (porcentaje / 100) * 5; // Convertir a escala de 0-5

        // Guardar resultado en la base de datos
        await this.respuestaRepository.saveResultado({
            intentoId,
            totalPreguntas: resultado.totalPreguntas,
            respuestasCorrectas: resultado.respuestasCorrectas,
            respuestasIncorrectas: resultado.respuestasIncorrectas,
            porcentaje,
            calificacion
        });

        // Finalizar intento
        const estado = tiempoAgotado ? 'tiempo_agotado' : 'finalizado';
        await this.examenRepository.finalizarIntento(intentoId, estado);

        // Retornar resultado con cálculos
        return {
            totalPreguntas: resultado.totalPreguntas,
            correctas: resultado.respuestasCorrectas,
            incorrectas: resultado.respuestasIncorrectas,
            porcentaje: porcentaje,
            calificacion: calificacion,
            aprobo: resultado.aprobo()
        };
    }
}
