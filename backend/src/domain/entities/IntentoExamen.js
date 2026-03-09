/**
 * Entidad de Dominio: Intento de Examen
 */
export class IntentoExamen {
    constructor({ id, usuarioId, examenId, fechaInicio, fechaFin, tiempoSegundos, estado }) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.examenId = examenId;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.tiempoSegundos = tiempoSegundos || 0;
        this.estado = estado || 'en_progreso';
    }

    // Reglas de negocio
    estaEnProgreso() {
        return this.estado === 'en_progreso';
    }

    estaFinalizado() {
        return this.estado === 'finalizado' || this.estado === 'tiempo_agotado';
    }

    finalizar(tiempoAgotado = false) {
        this.estado = tiempoAgotado ? 'tiempo_agotado' : 'finalizado';
        this.fechaFin = new Date();
    }

    actualizarTiempo(segundos) {
        if (this.estaEnProgreso()) {
            this.tiempoSegundos = segundos;
        }
    }

    getTiempoRestante(duracionTotal) {
        return Math.max(0, duracionTotal - this.tiempoSegundos);
    }
}
