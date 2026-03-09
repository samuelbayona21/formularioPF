/**
 * Página: Admin Detalle de Resultado
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { adminService } from '../services/adminService';
import Modal from '../components/Modal';

export default function AdminDetalle() {
    const { intentoId } = useParams();
    const navigate = useNavigate();
    const [detalle, setDetalle] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });

    useEffect(() => {
        if (!authService.isAdmin()) {
            navigate('/');
            return;
        }
        
        // Validar que intentoId existe
        if (!intentoId || intentoId === 'undefined') {
            setErrorModal({
                show: true,
                message: 'No se especificó un ID de resultado válido.'
            });
            setTimeout(() => navigate('/admin'), 2000);
            return;
        }
        
        cargarDetalle();
    }, [intentoId, navigate]);

    const cargarDetalle = async () => {
        try {
            setLoading(true);
            const data = await adminService.getDetalleResultado(intentoId);
            
            if (!data) {
                setErrorModal({
                    show: true,
                    message: 'No se encontró el resultado solicitado. Verifica que el ID sea correcto.'
                });
                setTimeout(() => navigate('/admin'), 2000);
                return;
            }
            
            setDetalle(data);
        } catch (error) {
            console.error('Error al cargar detalle:', error);
            setErrorModal({
                show: true,
                message: error.response?.status === 404 
                    ? 'No se encontró el resultado solicitado.' 
                    : 'Error al cargar el detalle del resultado.'
            });
            setTimeout(() => navigate('/admin'), 2000);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando detalle...</p>
                </div>
            </div>
        );
    }

    if (!detalle) return null;

    const respuestaActual = detalle.respuestas[currentQuestion];
    const totalPreguntas = detalle.respuestas.length;

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Header */}
            <header className="bg-dark-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-white">Detalle de la Prueba</h1>
                            <p className="text-sm text-gray-400">Revisión de Respuestas</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg border border-gray-600 transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Info del Usuario con RGB */}
                <div className="rgb-border bg-dark-800/50 backdrop-blur-xl rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Usuario</p>
                            <p className="rgb-text text-lg font-semibold">{detalle.usuario.nombreCompleto}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Cédula</p>
                            <p className="text-lg font-semibold text-white">{detalle.usuario.cedula}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Fecha</p>
                            <p className="text-lg font-semibold text-white">
                                {new Date(detalle.intento.fechaFin).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Porcentaje</p>
                            <p className={`text-2xl font-bold ${detalle.intento.porcentaje >= 60 ? 'text-green-400' : 'text-red-400'}`}>
                                {detalle.intento.porcentaje ? `${Number(detalle.intento.porcentaje).toFixed(2)}%` : '0%'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Estadísticas con RGB */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="rgb-border-slow bg-dark-800/50 backdrop-blur-xl rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{detalle.intento.respuestasCorrectas}</p>
                                <p className="text-sm text-gray-400">Correctas</p>
                                {(() => {
                                    const primeraCorrecta = detalle.respuestas.findIndex(r => r.es_correcta);
                                    return primeraCorrecta !== -1 && (
                                        <p className="text-xs text-green-400 mt-1">Desde pregunta {primeraCorrecta + 1}</p>
                                    );
                                })()}
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
                                <p className="text-2xl font-bold text-white">
                                    {detalle.intento.totalPreguntas - detalle.intento.respuestasCorrectas}
                                </p>
                                <p className="text-sm text-gray-400">Incorrectas</p>
                                {(() => {
                                    const primeraIncorrecta = detalle.respuestas.findIndex(r => !r.es_correcta);
                                    return primeraIncorrecta !== -1 && (
                                        <p className="text-xs text-red-400 mt-1">Desde pregunta {primeraIncorrecta + 1}</p>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    <div className="rgb-border-slow bg-dark-800/50 backdrop-blur-xl rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalPreguntas}</p>
                                <p className="text-sm text-gray-400">Total Preguntas</p>
                            </div>
                        </div>
                    </div>

                    <div className="rgb-border-slow bg-dark-800/50 backdrop-blur-xl rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {Math.floor(detalle.intento.tiempoSegundos / 60)}m
                                </p>
                                <p className="text-sm text-gray-400">Tiempo</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Pregunta Actual */}
                    <div className="flex-1">
                        <div className="bg-dark-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">
                                    Pregunta {currentQuestion + 1} de {totalPreguntas}
                                </h2>
                                <span className={`px-4 py-2 rounded-lg font-semibold ${
                                    respuestaActual.es_correcta 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                                }`}>
                                    {respuestaActual.es_correcta ? '✓ Correcta' : '✗ Incorrecta'}
                                </span>
                            </div>

                            <div className="mb-8">
                                <p className="text-sm text-gray-400 mb-2 font-medium">Pregunta:</p>
                                <p className="text-white text-lg leading-relaxed bg-dark-900/60 p-5 rounded-lg border border-gray-700">
                                    {respuestaActual.texto_pregunta}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className={`p-5 rounded-lg border-2 ${
                                    respuestaActual.es_correcta
                                        ? 'border-green-500 bg-green-500/10'
                                        : 'border-red-500 bg-red-500/10'
                                }`}>
                                    <p className="text-sm text-gray-400 mb-3 font-medium">Respuesta del usuario:</p>
                                    {respuestaActual.respuesta_usuario ? (
                                        <div className="flex items-start gap-3">
                                            <span className="inline-block w-10 h-10 rounded-full bg-white/10 text-center leading-10 font-bold flex-shrink-0">
                                                {respuestaActual.respuesta_usuario}
                                            </span>
                                            <p className="text-white font-medium text-base flex-1 pt-2">
                                                {respuestaActual.texto_respuesta_usuario || `Opción ${respuestaActual.respuesta_usuario}`}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 font-medium">No respondida</p>
                                    )}
                                </div>

                                {respuestaActual.respuesta_usuario !== respuestaActual.respuesta_correcta && (
                                    <div className="p-5 rounded-lg border-2 border-green-500 bg-green-500/10">
                                        <p className="text-sm text-gray-400 mb-3 font-medium">Respuesta correcta:</p>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-block w-10 h-10 rounded-full bg-green-500/20 text-center leading-10 font-bold flex-shrink-0">
                                                {respuestaActual.respuesta_correcta}
                                            </span>
                                            <p className="text-white font-medium text-base flex-1 pt-2">
                                                {respuestaActual.texto_respuesta_correcta || `Opción ${respuestaActual.respuesta_correcta}`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navegación */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                                <button
                                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                    disabled={currentQuestion === 0}
                                    className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    ← Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentQuestion(Math.min(totalPreguntas - 1, currentQuestion + 1))}
                                    disabled={currentQuestion === totalPreguntas - 1}
                                    className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Grid de Preguntas */}
                    <div className="w-64">
                        <div className="bg-dark-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 sticky top-24">
                            <h3 className="text-white font-semibold mb-4 pb-3 border-b border-primary-500">
                                Navegación
                            </h3>

                            <div className="grid grid-cols-6 gap-2">
                                {detalle.respuestas.map((resp, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentQuestion(index)}
                                        className={`aspect-square flex items-center justify-center rounded border-2 text-sm font-semibold transition-all hover:scale-110 ${
                                            index === currentQuestion
                                                ? 'bg-primary-500 border-primary-500 text-white'
                                                : resp.es_correcta
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'bg-red-500 border-red-500 text-white'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Error */}
            {errorModal.show && (
                <Modal
                    isOpen={errorModal.show}
                    onClose={() => {
                        setErrorModal({ show: false, message: '' });
                        navigate('/admin');
                    }}
                    title="Error"
                    message={errorModal.message}
                    type="error"
                    confirmText="Volver al Dashboard"
                />
            )}
        </div>
    );
}
