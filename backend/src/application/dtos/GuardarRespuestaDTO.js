/**
 * DTO: Guardar Respuesta
 */
export class GuardarRespuestaDTO {
    constructor({ pregunta_id, respuesta }) {
        this.preguntaId = pregunta_id;
        this.respuesta = respuesta;
    }

    validate() {
        const errors = [];

        if (!this.preguntaId) {
            errors.push('El ID de la pregunta es requerido');
        }

        if (!this.respuesta) {
            errors.push('La respuesta es requerida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
