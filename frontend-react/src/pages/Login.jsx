/**
 * Página: Login con efectos RGB
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Estados para manejar el focus de los inputs
    const [focusedInput, setFocusedInput] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isAdmin) {
            if (!cedula.trim() || !password.trim()) {
                setError('Por favor complete todos los campos');
                return;
            }

            try {
                setLoading(true);
                await authService.loginAdmin(cedula, password);
                navigate('/admin');
            } catch (err) {
                console.error('Error en login admin:', err);
                const errorMessage = err.message || 'Error al iniciar sesión como administrador';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            if (!nombreCompleto.trim() || !cedula.trim()) {
                setError('Por favor complete todos los campos');
                return;
            }

            if (cedula.length < 6) {
                setError('La cédula debe tener al menos 6 dígitos');
                return;
            }

            try {
                setLoading(true);
                await authService.login(nombreCompleto, cedula);
                navigate('/examen');
            } catch (err) {
                setError(err.message || 'Error al iniciar sesión');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggle = (adminMode) => {
        setIsAdmin(adminMode);
        setError('');
        setCedula('');
        setPassword('');
        setNombreCompleto('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ background: 'rgb(10, 14, 26)' }}>
            <div className="w-full max-w-[460px] mx-auto">
                {/* Card del formulario con efecto RGB */}
                <div 
                    className="rgb-border-slow"
                    style={{ 
                        background: 'linear-gradient(180deg, rgba(20, 30, 48, 0.98) 0%, rgba(10, 18, 30, 0.98) 100%)',
                        borderRadius: '32px',
                        padding: '32px 24px',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Logo con efecto RGB */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div 
                            className="rgb-border w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36"
                            style={{ 
                                borderRadius: '50%',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            <img 
                                src="/orb-logo.png" 
                                alt="Logo GAF" 
                                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain"
                            />
                        </div>
                    </div>

                    {/* Título con efecto RGB */}
                    <h1 className="rgb-text text-2xl sm:text-3xl text-center mb-6 sm:mb-8 leading-tight">
                        Prueba de<br />Conocimiento GAF
                    </h1>

                    {/* Toggle Admin/Usuario */}
                    <div className="flex gap-2 mb-6 sm:mb-7 p-1.5 bg-dark-900/70 rounded-2xl border border-primary-500/25">
                        <button
                            type="button"
                            onClick={() => handleToggle(false)}
                            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold border-none cursor-pointer transition-all ${
                                !isAdmin 
                                    ? 'bg-gradient-to-r from-blue-700 to-sky-400 text-white shadow-lg shadow-blue-500/50' 
                                    : 'bg-transparent text-gray-400'
                            }`}
                        >
                            Usuario
                        </button>
                        <button
                            type="button"
                            onClick={() => handleToggle(true)}
                            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold border-none cursor-pointer transition-all ${
                                isAdmin 
                                    ? 'bg-gradient-to-r from-blue-700 to-sky-400 text-white shadow-lg shadow-blue-500/50' 
                                    : 'bg-transparent text-gray-400'
                            }`}
                        >
                            Administrador
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl text-sm bg-red-500/10 border border-red-500/50 text-red-400 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                        {!isAdmin && (
                            <div>
                                <label className="block text-sm font-semibold mb-2.5 text-gray-300">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={nombreCompleto}
                                    onChange={(e) => setNombreCompleto(e.target.value)}
                                    placeholder="Ingresa tu nombre completo"
                                    disabled={loading}
                                    autoComplete="off"
                                    onFocus={() => setFocusedInput('nombre')}
                                    onBlur={() => setFocusedInput(null)}
                                    className={`w-full px-4 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base bg-dark-900/90 border-2 border-gray-600/40 text-white outline-none transition-all ${
                                        focusedInput === 'nombre' ? 'rgb-hover' : ''
                                    }`}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold mb-2.5 text-gray-300">
                                {isAdmin ? 'Usuario' : 'Cédula'}
                            </label>
                            <input
                                type="text"
                                value={cedula}
                                onChange={(e) => {
                                    const value = isAdmin ? e.target.value : e.target.value.replace(/\D/g, '');
                                    setCedula(value);
                                }}
                                placeholder={isAdmin ? 'Ingresa tu usuario' : 'Ingresa tu cédula'}
                                disabled={loading}
                                autoComplete="off"
                                onFocus={() => setFocusedInput('cedula')}
                                onBlur={() => setFocusedInput(null)}
                                className={`w-full px-4 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base bg-dark-900/90 border-2 border-gray-600/40 text-white outline-none transition-all ${
                                    focusedInput === 'cedula' ? 'rgb-hover' : ''
                                }`}
                            />
                        </div>

                        {isAdmin && (
                            <div>
                                <label className="block text-sm font-semibold mb-2.5 text-gray-300">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingresa tu contraseña"
                                    disabled={loading}
                                    autoComplete="off"
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    className={`w-full px-4 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base bg-dark-900/90 border-2 border-gray-600/40 text-white outline-none transition-all ${
                                        focusedInput === 'password' ? 'rgb-hover' : ''
                                    }`}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="rgb-pulse w-full px-6 py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg font-bold border-none cursor-pointer bg-gradient-to-r from-blue-600 to-sky-400 text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 mt-3"
                        >
                            <span>{loading ? 'Ingresando...' : 'Ingresar'}</span>
                            {!loading && (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
