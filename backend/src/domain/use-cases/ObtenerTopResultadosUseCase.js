/**
 * Caso de Uso: Obtener Top Resultados
 */
export class ObtenerTopResultadosUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(limit = 5) {
        const topResultados = await this.usuarioRepository.getTopResultados(limit);
        
        return topResultados.map((resultado, index) => ({
            posicion: index + 1,
            nombreCompleto: resultado.nombre_completo,
            cedula: resultado.cedula,
            porcentaje: parseFloat(resultado.porcentaje || 0).toFixed(2),
            respuestasCorrectas: resultado.respuestas_correctas,
            totalPreguntas: resultado.total_preguntas,
            tiempoSegundos: resultado.tiempo_segundos,
            tiempoFormateado: this.formatTiempo(resultado.tiempo_segundos),
            fechaFin: resultado.fecha_fin,
            intentoId: resultado.intento_id
        }));
    }

    formatTiempo(segundos) {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins}m ${secs}s`;
    }
}
