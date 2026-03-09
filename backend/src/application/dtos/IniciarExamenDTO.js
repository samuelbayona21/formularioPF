/**
 * DTO: Iniciar Examen
 * Data Transfer Object para la petición de inicio de examen
 */
export class IniciarExamenDTO {
    constructor({ nombre_completo, cedula }) {
        this.nombreCompleto = nombre_completo;
        this.cedula = cedula;
    }

    validate() {
        const errors = [];

        if (!this.nombreCompleto) {
            errors.push('El nombre completo es requerido');
        }

        if (!this.cedula) {
            errors.push('La cédula es requerida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
