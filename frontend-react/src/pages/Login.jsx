/**
 * Página: Login
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
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'rgb(10, 14, 26)' }}>
            {/* Contenedor principal con medidas lógicas */}
            <div style={{ 
                width: '100%', 
                maxWidth: '460px',
                margin: '0 auto'
            }}>
                {/* Card del formulario */}
                <div 
                    style={{ 
                        background: 'linear-gradient(180deg, rgba(20, 30, 48, 0.98) 0%, rgba(10, 18, 30, 0.98) 100%)',
                        borderRadius: '32px',
                        border: '3px solid rgba(37, 99, 235, 0.6)',
                        boxShadow: '0 0 40px rgba(37, 99, 235, 0.4), 0 20px 60px rgba(0, 0, 0, 0.5)',
                        padding: '40px 32px',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Logo */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                        <div 
                            style={{ 
                                width: '140px',
                                height: '140px',
                                borderRadius: '50%',
                                border: '5px solid rgb(37, 99, 235)',
                                boxShadow: '0 0 30px rgba(37, 99, 235, 0.7), 0 0 60px rgba(37, 99, 235, 0.4)',
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
                                style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    {/* Título */}
                    <h1 style={{ 
                        fontSize: '26px',
                        fontWeight: '700',
                        textAlign: 'center',
                        color: 'white',
                        marginBottom: '32px',
                        lineHeight: '1.3',
                        letterSpacing: '0.5px'
                    }}>
                        Prueba de<br />Conocimiento GAF
                    </h1>

                    {/* Toggle Admin/Usuario */}
                    <div 
                        style={{ 
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '28px',
                            padding: '6px',
                            background: 'rgba(10, 20, 35, 0.7)',
                            borderRadius: '16px',
                            border: '1px solid rgba(56, 189, 248, 0.25)'
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => handleToggle(false)}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                ...((!isAdmin) ? {
                                    background: 'linear-gradient(135deg, rgb(29, 78, 216) 0%, rgb(56, 189, 248) 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.5)'
                                } : {
                                    background: 'transparent',
                                    color: 'rgb(156, 163, 175)'
                                })
                            }}
                        >
                            Participante
                        </button>
                        <button
                            type="button"
                            onClick={() => handleToggle(true)}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                ...((isAdmin) ? {
                                    background: 'linear-gradient(135deg, rgb(29, 78, 216) 0%, rgb(56, 189, 248) 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.5)'
                                } : {
                                    background: 'transparent',
                                    color: 'rgb(156, 163, 175)'
                                })
                            }}
                        >
                            Administrador
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div 
                            style={{
                                marginBottom: '20px',
                                padding: '14px 16px',
                                borderRadius: '14px',
                                fontSize: '14px',
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.5)',
                                color: 'rgb(248, 113, 113)',
                                fontWeight: '500'
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {!isAdmin && (
                            <div>
                                <label style={{ 
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '10px',
                                    color: 'rgb(209, 213, 219)',
                                    letterSpacing: '0.3px'
                                }}>
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
                                    style={{
                                        width: '100%',
                                        padding: '14px 18px',
                                        borderRadius: '16px',
                                        fontSize: '15px',
                                        background: 'rgba(10, 18, 30, 0.9)',
                                        border: focusedInput === 'nombre' 
                                            ? '2px solid rgb(37, 99, 235)' 
                                            : '2px solid rgba(75, 85, 99, 0.4)',
                                        color: 'white',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        boxShadow: focusedInput === 'nombre' 
                                            ? '0 0 0 4px rgba(37, 99, 235, 0.15)' 
                                            : 'none'
                                    }}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ 
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '10px',
                                color: 'rgb(209, 213, 219)',
                                letterSpacing: '0.3px'
                            }}>
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
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    borderRadius: '16px',
                                    fontSize: '15px',
                                    background: 'rgba(10, 18, 30, 0.9)',
                                    border: focusedInput === 'cedula' 
                                        ? '2px solid rgb(37, 99, 235)' 
                                        : '2px solid rgba(75, 85, 99, 0.4)',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: focusedInput === 'cedula' 
                                        ? '0 0 0 4px rgba(37, 99, 235, 0.15)' 
                                        : 'none'
                                }}
                            />
                        </div>

                        {isAdmin && (
                            <div>
                                <label style={{ 
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '10px',
                                    color: 'rgb(209, 213, 219)',
                                    letterSpacing: '0.3px'
                                }}>
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
                                    style={{
                                        width: '100%',
                                        padding: '14px 18px',
                                        borderRadius: '16px',
                                        fontSize: '15px',
                                        background: 'rgba(10, 18, 30, 0.9)',
                                        border: focusedInput === 'password' 
                                            ? '2px solid rgb(37, 99, 235)' 
                                            : '2px solid rgba(75, 85, 99, 0.4)',
                                        color: 'white',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        boxShadow: focusedInput === 'password' 
                                            ? '0 0 0 4px rgba(37, 99, 235, 0.15)' 
                                            : 'none'
                                    }}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.6)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.5)';
                            }}
                            style={{
                                width: '100%',
                                padding: '16px 24px',
                                borderRadius: '16px',
                                fontSize: '18px',
                                fontWeight: '700',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                background: 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(56, 189, 248) 100%)',
                                color: 'white',
                                boxShadow: '0 8px 30px rgba(37, 99, 235, 0.5)',
                                transition: 'all 0.3s ease',
                                opacity: loading ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginTop: '12px'
                            }}
                        >
                            <span>{loading ? 'Ingresando...' : 'Ingresar'}</span>
                            {!loading && (
                                <svg style={{ width: '22px', height: '22px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
