/**
 * Entidad de Dominio: Usuario
 * Representa un usuario del sistema con sus reglas de negocio
 */
export class Usuario {
    constructor({ id, nombreCompleto, cedula, tipoUsuario, fechaRegistro }) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.cedula = cedula;
        this.tipoUsuario = tipoUsuario || 'estudiante';
        this.fechaRegistro = fechaRegistro;
    }

    // Reglas de negocio
    static validarCedula(cedula) {
        if (!cedula || typeof cedula !== 'string') {
            return { valid: false, error: 'Cédula es requerida' };
        }
        
        if (!/^\d+$/.test(cedula)) {
            return { valid: false, error: 'La cédula debe contener solo números' };
        }
        
        if (cedula.length < 6) {
            return { valid: false, error: 'La cédula debe tener al menos 6 dígitos' };
        }
        
        return { valid: true };
    }

    static validarNombre(nombre) {
        if (!nombre || typeof nombre !== 'string') {
            return { valid: false, error: 'Nombre es requerido' };
        }
        
        if (nombre.trim().length < 3) {
            return { valid: false, error: 'El nombre debe tener al menos 3 caracteres' };
        }
        
        return { valid: true };
    }

    esEstudiante() {
        return this.tipoUsuario === 'estudiante';
    }

    esAdministrador() {
        return this.tipoUsuario === 'administrador';
    }
}
