/**
 * Mapper: Usuario
 * Transforma entre entidades de dominio y DTOs/modelos de BD
 */
import { Usuario } from '../../domain/entities/Usuario.js';

export class UsuarioMapper {
    // De BD a Entidad de Dominio
    static toDomain(dbRow) {
        if (!dbRow) return null;
        
        return new Usuario({
            id: dbRow.id,
            nombreCompleto: dbRow.nombre_completo,
            cedula: dbRow.cedula,
            tipoUsuario: dbRow.tipo_usuario,
            fechaRegistro: dbRow.fecha_registro
        });
    }

    // De Entidad de Dominio a BD
    static toPersistence(usuario) {
        return {
            nombre_completo: usuario.nombreCompleto,
            cedula: usuario.cedula,
            tipo_usuario: usuario.tipoUsuario
        };
    }

    // De Entidad de Dominio a DTO de respuesta
    static toDTO(usuario) {
        return {
            id: usuario.id,
            nombre_completo: usuario.nombreCompleto,
            cedula: usuario.cedula,
            tipo_usuario: usuario.tipoUsuario
        };
    }
}
