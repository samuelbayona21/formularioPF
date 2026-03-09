/**
 * Entidad de Dominio: Resultado del Examen
 */
export class Resultado {
    constructor({ intentoId, totalPreguntas, respuestasCorrectas, respuestasIncorrectas }) {
        this.intentoId = intentoId;
        this.totalPreguntas = totalPreguntas;
        this.respuestasCorrectas = respuestasCorrectas || 0;
        this.respuestasIncorrectas = respuestasIncorrectas || 0;
    }

    calcularPorcentaje() {
        if (this.totalPreguntas === 0) return 0;
        return Math.round((this.respuestasCorrectas / this.totalPreguntas) * 100 * 100) / 100;
    }

    obtenerCalificacion() {
        const porcentaje = this.calcularPorcentaje();
        
        if (porcentaje >= 90) return { nota: 'Excelente', descripcion: 'Dominio sobresaliente' };
        if (porcentaje >= 80) return { nota: 'Muy Bueno', descripcion: 'Buen dominio' };
        if (porcentaje >= 70) return { nota: 'Bueno', descripcion: 'Dominio aceptable' };
        if (porcentaje >= 60) return { nota: 'Regular', descripcion: 'Necesita mejorar' };
        return { nota: 'Insuficiente', descripcion: 'Requiere refuerzo' };
    }

    aprobo(porcentajeMinimo = 70) {
        return this.calcularPorcentaje() >= porcentajeMinimo;
    }
}
