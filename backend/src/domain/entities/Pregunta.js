/**
 * Entidad de Dominio: Pregunta
 */
export class Pregunta {
    constructor({ id, examenId, numeroPregunta, textoPregunta, respuestaCorrecta, opciones }) {
        this.id = id;
        this.examenId = examenId;
        this.numeroPregunta = numeroPregunta;
        this.textoPregunta = textoPregunta;
        this.respuestaCorrecta = respuestaCorrecta;
        this.opciones = opciones || [];
    }

    validarRespuesta(respuesta) {
        return respuesta === this.respuestaCorrecta;
    }

    agregarOpcion(opcion) {
        this.opciones.push(opcion);
    }
}
