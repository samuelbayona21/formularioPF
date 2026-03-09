/**
 * Caso de Uso: Obtener Detalle de Resultado de un Usuario
 */
export class ObtenerDetalleResultadoUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(intentoId) {
        if (!intentoId) {
            throw new Error('ID de intento requerido');
        }

        const detalle = await this.usuarioRepository.getDetalleResultado(intentoId);
        
        if (!detalle) {
            throw new Error('Resultado no encontrado');
        }

        return {
            usuario: {
                nombreCompleto: detalle.nombre_completo,
                cedula: detalle.cedula
            },
            intento: {
                id: detalle.intento_id,
                calificacion: detalle.calificacion,
                totalPreguntas: detalle.total_preguntas,
                respuestasCorrectas: detalle.respuestas_correctas,
                porcentaje: detalle.porcentaje,
                estado: detalle.estado,
                tiempoSegundos: detalle.tiempo_segundos,
                fechaInicio: detalle.fecha_inicio,
                fechaFin: detalle.fecha_fin
            },
            respuestas: detalle.respuestas || []
        };
    }
}
