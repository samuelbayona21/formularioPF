/**
 * Caso de Uso: Login de Administrador
 */
export class LoginAdminUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(cedula, password) {
        if (!cedula || cedula.trim() === '') {
            throw new Error('Usuario requerido');
        }

        if (!password || password.trim() === '') {
            throw new Error('Contraseña requerida');
        }

        const usuario = await this.usuarioRepository.findByCedula(cedula);

        if (!usuario) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        if (!usuario.esAdministrador()) {
            throw new Error('Acceso denegado: No tiene permisos de administrador');
        }

        // Validar contraseña
        const isValidPassword = await this.usuarioRepository.validatePassword(cedula, password);
        
        if (!isValidPassword) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        return {
            usuarioId: usuario.id,
            nombreCompleto: usuario.nombreCompleto,
            cedula: usuario.cedula,
            tipoUsuario: usuario.tipoUsuario
        };
    }
}
