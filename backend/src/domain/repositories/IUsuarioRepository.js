/**
 * Interface: Repositorio de Usuario
 * Define el contrato que debe cumplir cualquier implementación
 */
export class IUsuarioRepository {
    async findByCedula(cedula) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async create(usuario) {
        throw new Error('Method not implemented');
    }

    async update(id, usuario) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }
}
