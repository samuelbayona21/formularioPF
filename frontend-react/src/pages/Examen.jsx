/**
 * Página: Examen con Tailwind
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { examenService } from '../services/examenService';
import { useExamen } from '../hooks/useExamen';
import { useTimer } from '../hooks/useTimer';
import Modal from '../components/Modal';

export default function Examen() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showTimeWarning, setShowTimeWarning] = useState(false);
    const [examFinished, setExamFinished] = useState(false);
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });

    const {
        preguntas,
        respuestas,
        currentQuestion,
        loading,
        error,
        guardarRespuesta,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        getProgress
    } = useExamen();

    const handleTimeUp = async () => {
        if (!examFinished) {
            await finalizarExamen(true);
        }
    };

    const { timeRemaining, start, stop, formatTime, setTimeRemaining } = useTimer(1500, handleTimeUp);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/');
            return;
        }

        const loadTime = async () => {
            try {
                const tiempoTranscurrido = await examenService.obtenerTiempo();
                const tiempoRestante = 1500 - tiempoTranscurrido;
                
                if (tiempoRestante > 0) {
                    setTimeRemaining(tiempoRestante);
                    start();
                } else {
                    setTimeRemaining(0);
                }
            } catch (err) {
                console.error('Error al cargar tiempo:', err);
                setTimeRemaining(1500);
                start();
            }
        };

        if (preguntas.length > 0) {
            loadTime();
        }
    }, [preguntas.length]);

    useEffect(() => {
        if (examFinished) return;

        const interval = setInterval(async () => {
            const tiempoTranscurrido = 1500 - timeRemaining;
            try {
                await examenService.guardarTiempo(tiempoTranscurrido);
            } catch (err) {
                console.error('Error al guardar tiempo:', err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [timeRemaining, examFinished]);

    useEffect(() => {
        if (timeRemaining === 300 && !showTimeWarning) {
            setShowTimeWarning(true);
        }
    }, [timeRemaining, showTimeWarning]);

    const finalizarExamen = async (tiempoAgotado = false) => {
        if (examFinished) return;

        setExamFinished(true);
        stop();

        try {
            const tiempoTranscurrido = 1500 - timeRemaining;
            await examenService.guardarTiempo(tiempoTranscurrido);
            const resultado = await examenService.finalizarExamen(tiempoAgotado);
            localStorage.setItem('resultado', JSON.stringify(resultado));
            navigate('/resultado');
        } catch (err) {
            console.error('Error al finalizar examen:', err);
            setErrorModal({ 
                show: true, 
                message: 'Hubo un error al finalizar el examen. Por favor, intenta nuevamente.' 
            });
            setExamFinished(false);
        }
    };

    const handleFinish = () => {
        const progress = getProgress();
        const unanswered = progress.total - progress.answered;

        // Siempre mostrar modal de confirmación
        setShowModal(true);
    };

    const confirmFinish = () => {
        setShowModal(false);
        finalizarExamen(false);
    };

    const getQuestionStatus = (index) => {
        const pregunta = preguntas[index];
        if (!pregunta) return 'pending';
        
        if (index === currentQuestion) return 'current';
        if (respuestas[pregunta.id]) return 'answered';
        return 'pending';
    };

    const getQuestionColor = (status) => {
        const colors = {
            'answered': 'bg-green-500 border-green-500 text-white',
            'pending': 'bg-red-500/20 border-red-500 text-red-400',
            'current': 'bg-yellow-500 border-yellow-500 text-white'
        };
        return colors[status] || colors.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando examen...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Error: {error}</p>
                    <button onClick={() => navigate('/')} className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    const progress = getProgress();
    const preguntaActual = preguntas[currentQuestion];

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary-700 to-primary-500 text-white px-6 py-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Prueba de Conocimiento GAF</h1>
                        <p className="text-sm opacity-90">Usuario: {authService.getNombreCompleto()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm opacity-90">Tiempo restante:</p>
                            <p className={`text-2xl font-bold ${timeRemaining < 300 ? 'animate-pulse text-yellow-300' : ''}`}>
                                {formatTime()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-90">Fecha:</p>
                            <p className="text-sm">{new Date().toLocaleDateString('es-ES')}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-dark-900/50 border-b border-gray-800 px-6 py-3">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progreso del Examen</span>
                        <span>{progress.answered} de {progress.total} respondidas</span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-3 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary-700 to-primary-500 transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
                {/* Question Area */}
                <div className="flex-1">
                    <div className="bg-dark-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-8 mb-6">
                        <h2 className="text-lg font-semibold text-white mb-6">
                            Pregunta {currentQuestion + 1} de {preguntas.length}
                        </h2>

                        {preguntaActual && (
                            <>
                                <p className="text-white text-lg mb-8 leading-relaxed">
                                    {preguntaActual.texto_pregunta}
                                </p>

                                <div className="space-y-3">
                                    {preguntaActual.opciones.map((opcion) => (
                                        <label
                                            key={opcion.id}
                                            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                respuestas[preguntaActual.id] === opcion.letra_opcion
                                                    ? 'border-primary-500 bg-primary-500/20'
                                                    : 'border-gray-600 bg-dark-900/60 hover:border-primary-500/50 hover:bg-primary-500/10'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`pregunta-${preguntaActual.id}`}
                                                value={opcion.letra_opcion}
                                                checked={respuestas[preguntaActual.id] === opcion.letra_opcion}
                                                onChange={() => guardarRespuesta(preguntaActual.id, opcion.letra_opcion)}
                                                className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="ml-3 text-white flex-1">
                                                {opcion.letra_opcion}. {opcion.texto_opcion}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between gap-4">
                        <button
                            onClick={prevQuestion}
                            disabled={currentQuestion === 0}
                            className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-lg border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={nextQuestion}
                            disabled={currentQuestion === preguntas.length - 1}
                            className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-lg border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Siguiente →
                        </button>
                        {/* Botón Finalizar solo visible en la pregunta 50 */}
                        {currentQuestion === 49 && (
                            <button
                                onClick={handleFinish}
                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-semibold shadow-lg transition-all"
                            >
                                Finalizar Examen
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar - Question Grid */}
                <div className="w-64">
                    <div className="bg-dark-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 sticky top-6">
                        <h3 className="text-white font-semibold mb-4 pb-3 border-b border-primary-500">
                            Navegación de Preguntas
                        </h3>

                        {/* Legend */}
                        <div className="mb-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-green-500"></div>
                                <span className="text-gray-400">Respondida</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-red-500/20 border-2 border-red-500"></div>
                                <span className="text-gray-400">Pendiente</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-yellow-500"></div>
                                <span className="text-gray-400">Actual</span>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-6 gap-2">
                            {preguntas.map((_, index) => {
                                const status = getQuestionStatus(index);
                                return (
                                    <button
                                        key={index}
                                        onClick={() => goToQuestion(index)}
                                        className={`aspect-square flex items-center justify-center rounded border-2 text-sm font-semibold transition-all hover:scale-110 ${getQuestionColor(status)}`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación */}
            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="¿Finalizar Examen?"
                    message={
                        progress.answered === progress.total 
                            ? `Has respondido todas las preguntas (${progress.answered} de ${progress.total}). ¿Deseas finalizar el examen?`
                            : `Has respondido ${progress.answered} de ${progress.total} preguntas. Quedan ${progress.total - progress.answered} sin responder. ¿Deseas finalizar el examen de todas formas?`
                    }
                    type="warning"
                    confirmText="Finalizar"
                    cancelText="Cancelar"
                    showCancel={true}
                    onConfirm={confirmFinish}
                />
            )}

            {/* Modal de Advertencia de Tiempo */}
            {showTimeWarning && (
                <Modal
                    isOpen={showTimeWarning}
                    onClose={() => setShowTimeWarning(false)}
                    title="¡Atención!"
                    message="Quedan solo 5 minutos para finalizar el examen."
                    type="warning"
                    confirmText="Entendido"
                />
            )}

            {/* Modal de Error */}
            {errorModal.show && (
                <Modal
                    isOpen={errorModal.show}
                    onClose={() => setErrorModal({ show: false, message: '' })}
                    title="Error"
                    message={errorModal.message}
                    type="error"
                    confirmText="Aceptar"
                />
            )}
        </div>
    );
}
