/**
 * Caso de Uso: Iniciar Examen
 * Lógica de negocio para iniciar un examen
 */
import { Usuario } from '../entities/Usuario.js';

export class IniciarExamenUseCase {
    constructor(usuarioRepository, examenRepository) {
        this.usuarioRepository = usuarioRepository;
        this.examenRepository = examenRepository;
    }

    async execute(nombreCompleto, cedula) {
        // Validar datos de entrada
        const validacionNombre = Usuario.validarNombre(nombreCompleto);
        if (!validacionNombre.valid) {
            throw new Error(validacionNombre.error);
        }

        const validacionCedula = Usuario.validarCedula(cedula);
        if (!validacionCedula.valid) {
            throw new Error(validacionCedula.error);
        }

        // Buscar o crear usuario
        let usuario = await this.usuarioRepository.findByCedula(cedula);
        
        if (usuario) {
            // Actualizar nombre si cambió
            if (usuario.nombreCompleto !== nombreCompleto) {
                usuario.nombreCompleto = nombreCompleto;
                await this.usuarioRepository.update(usuario.id, usuario);
            }
        } else {
            // Crear nuevo usuario
            usuario = new Usuario({
                nombreCompleto,
                cedula,
                tipoUsuario: 'estudiante'
            });
            const usuarioId = await this.usuarioRepository.create(usuario);
            usuario.id = usuarioId;
        }

        // Verificar si ya tiene un intento en progreso
        let intento = await this.examenRepository.findIntentoEnProgreso(usuario.id);
        
        if (!intento) {
            // Crear nuevo intento
            const intentoId = await this.examenRepository.createIntento(usuario.id, 1);
            intento = { id: intentoId };
        }

        return {
            usuarioId: usuario.id,
            intentoId: intento.id,
            nombreCompleto: usuario.nombreCompleto
        };
    }
}
