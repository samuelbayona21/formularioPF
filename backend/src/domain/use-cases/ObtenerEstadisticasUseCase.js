/**
 * Caso de Uso: Obtener Estadísticas del Dashboard
 */
export class ObtenerEstadisticasUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute() {
        const stats = await this.usuarioRepository.getEstadisticas();
        
        return {
            totalUsuarios: stats.total_usuarios || 0,
            totalExamenes: stats.total_examenes || 0,
            examenesCompletados: stats.examenes_completados || 0,
            examenesEnProgreso: stats.examenes_en_progreso || 0,
            promedioCalificacion: parseFloat(stats.promedio_calificacion || 0).toFixed(2),
            tasaAprobacion: parseFloat(stats.tasa_aprobacion || 0).toFixed(2)
        };
    }
}
