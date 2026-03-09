/**
 * Página: Admin Dashboard
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { adminService } from '../services/adminService';
import Modal from '../components/Modal';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [estadisticas, setEstadisticas] = useState(null);
    const [resultados, setResultados] = useState([]);
    const [topResultados, setTopResultados] = useState([]);
    const [filtros, setFiltros] = useState({ estado: '', cedula: '', nombre: '' });
    const [loading, setLoading] = useState(true);
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });

    useEffect(() => {
        if (!authService.isAdmin()) {
            navigate('/');
            return;
        }
        cargarDatos();
    }, [navigate]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [stats, results, top] = await Promise.all([
                adminService.getEstadisticas(),
                adminService.getResultados(filtros),
                adminService.getTopResultados(5)
            ]);
            setEstadisticas(stats);
            // Filtrar solo resultados con intentoId válido
            const resultadosValidos = results.filter(r => r.intentoId && r.intentoId !== null);
            setResultados(resultadosValidos);
            setTopResultados(top);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            // Si es error 403, la sesión expiró
            if (error.response?.status === 403) {
                setErrorModal({
                    show: true,
                    message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
                });
                authService.logoutAdmin();
                setTimeout(() => navigate('/'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerDetalle = (intentoId) => {
        if (!intentoId || intentoId === null || intentoId === undefined) {
            alert('Este resultado no tiene un ID válido. El usuario debe completar el examen primero.');
            return;
        }
        navigate(`/admin/resultado/${intentoId}`);
    };

    const handleFiltrar = () => {
        // Limpiar espacios en blanco de los filtros
        const filtrosLimpios = {
            estado: filtros.estado.trim(),
            cedula: filtros.cedula.trim(),
            nombre: filtros.nombre.trim()
        };
        setFiltros(filtrosLimpios);
        cargarDatos();
    };

    const handleLimpiar = () => {
        setFiltros({ estado: '', cedula: '', nombre: '' });
        setTimeout(() => cargarDatos(), 100);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleFiltrar();
        }
    };

    const handleLogout = async () => {
        await authService.logoutAdmin();
        navigate('/');
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            'completado': 'bg-green-500/20 text-green-400 border-green-500/50',
            'en_progreso': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            'tiempo_agotado': 'bg-red-500/20 text-red-400 border-red-500/50'
        };
        return badges[estado] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    };

    const formatTiempo = (segundos) => {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Header */}
            <header className="bg-dark-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/orb-logo.png" alt="Logo" className="h-10 w-10" />
                            <div>
                                <h1 className="text-xl font-bold text-white">Panel Administrativo</h1>
                                <p className="text-sm text-gray-400">Resultados de Pruebas</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/50 transition-all"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Estadísticas con RGB */}
                {estadisticas && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="rgb-border-slow bg-dark-800/50 backdrop-blur-xl rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-500/20 rounded-lg">
                                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{estadisticas.totalUsuarios}</p>
                                    <p className="text-sm text-gray-400">Total Usuarios</p>
                                </div>
                            </div>
                        </div>

                        <div className="rgb-border-slow bg-dark-800/50 backdrop-blur-xl rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{estadisticas.examenesCompletados}</p>
                                    <p className="text-sm text-gray-400">Aprobados</p>
                                </div>
                            </div>
                        </div>

                        <div className="rgb-border-slow bg-dark-800/50 backdrop-blur-xl rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-500/20 rounded-lg">
                                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{estadisticas.totalExamenes - estadisticas.examenesCompletados}</p>
                                    <p className="text-sm text-gray-400">Reprobados</p>
                                </div>
                            </div>
                        </div>

                        <div className="rgb-border-slow bg-dark-800/50 backdrop-blur-xl rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-yellow-500/20 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{estadisticas.promedioCalificacion}</p>
                                    <p className="text-sm text-gray-400">Promedio General</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top 5 Mejores Resultados */}
                {topResultados && topResultados.length > 0 && (
                    <div className="bg-dark-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-yellow-500/20 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Top 5 Mejores Resultados</h2>
                                    <p className="text-sm text-gray-400">Usuarios con mejor desempeño</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {topResultados.map((resultado) => (
                                <div 
                                    key={resultado.intentoId}
                                    className={`rgb-hover flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                                        resultado.posicion === 1 
                                            ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/50' 
                                            : resultado.posicion === 2
                                            ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-2 border-gray-400/50'
                                            : resultado.posicion === 3
                                            ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/10 border-2 border-orange-600/50'
                                            : 'bg-dark-900/60 border-2 border-gray-600/30'
                                    }`}
                                    onClick={() => handleVerDetalle(resultado.intentoId)}
                                >
                                    {/* Posición */}
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                                        resultado.posicion === 1 
                                            ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' 
                                            : resultado.posicion === 2
                                            ? 'bg-gray-400 text-white shadow-lg shadow-gray-400/50'
                                            : resultado.posicion === 3
                                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/50'
                                            : 'bg-primary-600 text-white'
                                    }`}>
                                        {resultado.posicion === 1 ? '🥇' : resultado.posicion === 2 ? '🥈' : resultado.posicion === 3 ? '🥉' : resultado.posicion}
                                    </div>

                                    {/* Info del usuario */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-white font-semibold truncate">{resultado.nombreCompleto}</p>
                                            <span className="text-xs text-gray-500 flex-shrink-0">CI: {resultado.cedula}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-400">
                                                <span className="text-green-400 font-semibold">{resultado.respuestasCorrectas}</span>/{resultado.totalPreguntas} correctas
                                            </span>
                                            <span className="text-gray-400">
                                                ⏱️ {resultado.tiempoFormateado}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(resultado.fechaFin).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Porcentaje */}
                                    <div className="flex-shrink-0 text-right">
                                        <p className={`text-3xl font-bold ${
                                            resultado.posicion <= 3 ? 'text-yellow-400' : 'text-green-400'
                                        }`}>
                                            {resultado.porcentaje}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-dark-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Filtros de Búsqueda</h2>
                        {(filtros.nombre || filtros.cedula || filtros.estado) && (
                            <span className="text-sm text-primary-400">
                                Filtros activos
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={filtros.nombre}
                                onChange={(e) => setFiltros({...filtros, nombre: e.target.value})}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-2.5 bg-dark-900/60 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Cédula</label>
                            <input
                                type="text"
                                placeholder="Buscar por cédula..."
                                value={filtros.cedula}
                                onChange={(e) => setFiltros({...filtros, cedula: e.target.value})}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-2.5 bg-dark-900/60 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Estado</label>
                            <select
                                value={filtros.estado}
                                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                                className="w-full px-4 py-2.5 bg-dark-900/60 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            >
                                <option value="">Todos los estados</option>
                                <option value="finalizado">Finalizado</option>
                                <option value="en_progreso">En Progreso</option>
                                <option value="tiempo_agotado">Tiempo Agotado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Acciones</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleFiltrar}
                                    className="rgb-hover flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Buscar
                                </button>
                                <button
                                    onClick={handleLimpiar}
                                    className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
                                    title="Limpiar filtros"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Presiona Enter en los campos de texto para buscar rápidamente
                    </p>
                </div>

                {/* Tabla de Resultados */}
                <div className="bg-dark-800/50 backdrop-blur-xl border border-gray-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-900/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cédula</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Porcentaje</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Progreso</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Correctas</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Incorrectas</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tiempo</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {resultados.map((resultado) => (
                                    <tr key={resultado.id} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{resultado.nombreCompleto}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{resultado.cedula}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${resultado.porcentaje >= 60 ? 'text-green-400' : 'text-red-400'}`}>
                                                {resultado.porcentaje ? Number(resultado.porcentaje).toFixed(2) : '0.00'}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-dark-900 rounded-full h-3 w-32 overflow-hidden border border-gray-700">
                                                        <div 
                                                            className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all shadow-lg shadow-green-500/50"
                                                            style={{ width: `${(resultado.respuestasCorrectas / resultado.totalPreguntas) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-400 font-medium min-w-[60px]">
                                                        {resultado.respuestasCorrectas}/{resultado.totalPreguntas}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 text-xs">
                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30">
                                                        ✓ {resultado.respuestasCorrectas} correctas
                                                    </span>
                                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30">
                                                        ✗ {resultado.totalPreguntas - resultado.respuestasCorrectas} incorrectas
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{resultado.respuestasCorrectas || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{(resultado.totalPreguntas - resultado.respuestasCorrectas) || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatTiempo(resultado.tiempoSegundos || 0)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {resultado.fechaFin ? new Date(resultado.fechaFin).toLocaleDateString('es-ES') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleVerDetalle(resultado.intentoId)}
                                                disabled={!resultado.intentoId}
                                                className="rgb-hover px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {resultados.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No se encontraron resultados</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Error */}
            {errorModal.show && (
                <Modal
                    isOpen={errorModal.show}
                    onClose={() => {
                        setErrorModal({ show: false, message: '' });
                        navigate('/');
                    }}
                    title="Sesión Expirada"
                    message={errorModal.message}
                    type="warning"
                    confirmText="Ir al Login"
                />
            )}
        </div>
    );
}
