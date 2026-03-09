/**
 * LÓGICA DE LA PÁGINA DE LOGIN - VERSIÓN MODERNA
 * Maneja el registro del estudiante e inicio del examen
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const nombreInput = document.getElementById('nombreCompleto');
    const cedulaInput = document.getElementById('cedula');
    const loginButton = loginForm.querySelector('.login-button');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nombreCompleto = nombreInput.value.trim();
        const cedula = cedulaInput.value.trim();
        
        // Validaciones
        if (!nombreCompleto) {
            showMessage('Por favor ingresa tu nombre completo', 'error');
            nombreInput.focus();
            return;
        }
        
        if (!cedula) {
            showMessage('Por favor ingresa tu cédula', 'error');
            cedulaInput.focus();
            return;
        }
        
        // Validar que la cédula solo contenga números
        if (!/^\d+$/.test(cedula)) {
            showMessage('La cédula debe contener solo números', 'error');
            cedulaInput.focus();
            return;
        }
        
        if (nombreCompleto.length < 3) {
            showMessage('El nombre debe tener al menos 3 caracteres', 'error');
            nombreInput.focus();
            return;
        }
        
        if (cedula.length < 5) {
            showMessage('La cédula debe tener al menos 5 caracteres', 'error');
            cedulaInput.focus();
            return;
        }
        
        // Agregar clase de carga al botón
        loginButton.classList.add('loading');
        loginButton.disabled = true;
        const originalText = loginButton.innerHTML;
        loginButton.innerHTML = '<span>Iniciando...</span>';
        
        try {
            // Registrar estudiante e iniciar examen
            const response = await fetch('/examen_contadores/api/iniciar-examen.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre_completo: nombreCompleto,
                    cedula: cedula
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Guardar datos en sessionStorage
                sessionStorage.setItem('intento_id', data.intento_id);
                sessionStorage.setItem('usuario_id', data.usuario_id);
                sessionStorage.setItem('nombre_completo', nombreCompleto);
                sessionStorage.setItem('cedula', cedula);
                
                // Mostrar mensaje de éxito
                loginButton.innerHTML = '<span>✓ Redirigiendo...</span>';
                
                // Redirigir al examen después de un breve delay
                setTimeout(() => {
                    window.location.href = 'views/examen.html';
                }, 500);
            } else {
                showMessage(data.message || 'Error al iniciar el examen', 'error');
                loginButton.classList.remove('loading');
                loginButton.disabled = false;
                loginButton.innerHTML = originalText;
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión. Por favor intente nuevamente.', 'error');
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
            loginButton.innerHTML = originalText;
        }
    });
    
    // Agregar efecto de focus en los inputs
    const inputs = [nombreInput, cedulaInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

/**
 * Muestra un mensaje al usuario
 */
function showMessage(message, type) {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.alert-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert-message alert-${type}`;
    
    const icon = type === 'error' 
        ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>`
        : `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 8L9 12L7 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>`;
    
    messageDiv.innerHTML = `${icon}<span>${message}</span>`;
    
    const form = document.querySelector('.login-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Animación de entrada
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}
