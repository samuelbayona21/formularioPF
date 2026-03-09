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
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center animate-slide-up">
                {/* Icono de éxito */}
                <div className="mb-8 flex justify-center">
                    <div className="p-6 bg-green-500/20 rounded-full animate-pulse-slow">
                        <svg className="w-24 h-24 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Título */}
                <h1 className="text-4xl font-bold text-white mb-4">
                    ¡Examen Finalizado!
                </h1>

                {/* Mensaje */}
                <p className="text-xl text-gray-400 mb-8">
                    Tu respuesta ha sido enviada correctamente.
                    <br />
                    Gracias por completar la prueba.
                </p>

                {/* Botón */}
                <button
                    onClick={handleSalir}
                    className="px-8 py-4 bg-gradient-to-r from-primary-700 to-primary-500 hover:from-primary-800 hover:to-primary-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                    Salir
                </button>
            </div>
        </div>
    );
}
