/**
 * Caso de Uso: Obtener Resultados de Todos los Usuarios
 */
export class ObtenerResultadosUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(filtros = {}) {
        const resultados = await this.usuarioRepository.getAllResultados(filtros);
        
        return resultados.map(r => ({
            id: r.id,
            intentoId: r.intento_id,
            nombreCompleto: r.nombre_completo,
            cedula: r.cedula,
            calificacion: r.calificacion,
            totalPreguntas: r.total_preguntas,
            respuestasCorrectas: r.respuestas_correctas,
            porcentaje: r.porcentaje,
            estado: r.estado,
            tiempoSegundos: r.tiempo_segundos,
            fechaInicio: r.fecha_inicio,
            fechaFin: r.fecha_fin
        }));
    }
}
