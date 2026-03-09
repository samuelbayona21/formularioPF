/**
 * Admin Service - Operaciones administrativas
 */
import api from './api';

export const adminService = {
    async getEstadisticas() {
        const response = await api.get('/admin/estadisticas');
        return response.data.estadisticas;
    },

    async getResultados(filtros = {}) {
        const params = new URLSearchParams();
        if (filtros.estado) params.append('estado', filtros.estado);
        if (filtros.cedula) params.append('cedula', filtros.cedula);
        if (filtros.nombre) params.append('nombre', filtros.nombre);

        const response = await api.get(`/admin/resultados?${params.toString()}`);
        return response.data.resultados;
    },

    async getDetalleResultado(intentoId) {
        const response = await api.get(`/admin/resultado/${intentoId}`);
        return response.data.detalle;
    }
};
