/**
 * Página: Resultado
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Resultado() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const handleSalir = () => {
        authService.logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl w-full text-center animate-slide-up">
                {/* Card con efecto RGB */}
                <div className="rgb-border-slow bg-dark-800/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12">
                    {/* Icono de éxito con RGB */}
                    <div className="mb-6 sm:mb-8 flex justify-center">
                        <div className="rgb-border p-4 sm:p-6 bg-green-500/20 rounded-full animate-pulse-slow">
                            <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Título con RGB */}
                    <h1 className="rgb-text text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">
                        ¡Examen Finalizado!
                    </h1>

                    {/* Mensaje */}
                    <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-4">
                        Tu respuesta ha sido enviada correctamente.
                        <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                        Gracias por completar la prueba.
                    </p>

                    {/* Botón con RGB */}
                    <button
                        onClick={handleSalir}
                        className="rgb-pulse w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-700 to-primary-500 hover:from-primary-800 hover:to-primary-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>
    );
}
