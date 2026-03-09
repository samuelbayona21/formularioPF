/**
 * Entidad de Dominio: Respuesta del Estudiante
 */
export class Respuesta {
    constructor({ id, intentoId, preguntaId, respuestaSeleccionada, esCorrecta, fechaRespuesta }) {
        this.id = id;
        this.intentoId = intentoId;
        this.preguntaId = preguntaId;
        this.respuestaSeleccionada = respuestaSeleccionada;
        this.esCorrecta = esCorrecta;
        this.fechaRespuesta = fechaRespuesta;
    }

    actualizar(nuevaRespuesta, esCorrecta) {
        this.respuestaSeleccionada = nuevaRespuesta;
        this.esCorrecta = esCorrecta;
        this.fechaRespuesta = new Date();
    }
}
