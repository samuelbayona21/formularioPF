/**
 * API Service - Cliente HTTP con Axios
 */
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    response => response,
    error => {
        // Solo redirigir en 401 si NO es una petición de login
        const isLoginRequest = error.config?.url?.includes('/login');
        
        if (error.response?.status === 401 && !isLoginRequest) {
            // Sesión expirada (pero no en login)
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
