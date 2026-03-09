/**
 * Auth Service - Manejo de autenticación
 */
import api from './api';

export const authService = {
    async login(nombreCompleto, cedula) {
        const response = await api.post('/auth/login', {
            nombre_completo: nombreCompleto,
            cedula: cedula
        });
        
        if (response.data.success) {
            // Backend devuelve en camelCase
            const { usuarioId, intentoId, nombreCompleto: nombre } = response.data.data;
            
            // Guardar en localStorage
            localStorage.setItem('usuario_id', usuarioId);
            localStorage.setItem('intento_id', intentoId);
            localStorage.setItem('nombre_completo', nombre);
            localStorage.setItem('user_type', 'estudiante');
            
            return response.data;
        }
        
        throw new Error(response.data.message || 'Error al iniciar sesión');
    },

    async loginAdmin(cedula, password) {
        try {
            const response = await api.post('/admin/login', {
                cedula,
                password
            });

            if (response.data.success) {
                localStorage.setItem('admin_id', response.data.data.usuarioId);
                localStorage.setItem('admin_nombre', response.data.data.nombreCompleto);
                localStorage.setItem('user_type', 'administrador');
                return response.data;
            }

            throw new Error(response.data.message || 'Error al iniciar sesión');
        } catch (error) {
            // Si es un error de axios con respuesta del servidor
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            // Si ya es un Error lanzado arriba
            if (error.message) {
                throw error;
            }
            // Error genérico
            throw new Error('Error al iniciar sesión como administrador');
        }
    },

    async logoutAdmin() {
        try {
            await api.post('/admin/logout');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.clear();
        }
    },

    logout() {
        localStorage.clear();
    },

    isAuthenticated() {
        return !!localStorage.getItem('intento_id');
    },

    isAdmin() {
        return localStorage.getItem('user_type') === 'administrador';
    },

    getUsuarioId() {
        return localStorage.getItem('usuario_id');
    },

    getIntentoId() {
        return localStorage.getItem('intento_id');
    },

    getNombreCompleto() {
        return localStorage.getItem('nombre_completo');
    },

    getAdminNombre() {
        return localStorage.getItem('admin_nombre');
    }
};
