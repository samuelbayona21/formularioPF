/**
 * LÓGICA DE LOGIN ADMINISTRATIVO
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = loginForm.querySelector('.login-button');
    
    // Verificar si ya está autenticado
    if (sessionStorage.getItem('admin_authenticated') === 'true') {
        window.location.href = 'dashboard.html';
        return;
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validación de usuarios administradores
        const validUsers = [
            { username: 'admin', password: 'admin123' },
            { username: 'Oscar Solano', password: 'oscar2026*' }
        ];
        
        const isValid = validUsers.some(user => 
            user.username === username && user.password === password
        );
        
        if (isValid) {
            // Guardar sesión
            sessionStorage.setItem('admin_authenticated', 'true');
            sessionStorage.setItem('admin_username', username);
            
            // Mostrar éxito
            loginButton.innerHTML = '<span>✓ Acceso concedido</span>';
            loginButton.style.background = 'linear-gradient(135deg, #10b981, #22c55e)';
            
            // Redirigir
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            showMessage('Usuario o contraseña incorrectos', 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
});

/**
 * Muestra un mensaje al usuario
 */
function showMessage(message, type) {
    const existingMessage = document.querySelector('.alert-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert-message alert-${type}`;
    
    const icon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    
    messageDiv.innerHTML = `${icon}<span>${message}</span>`;
    
    const form = document.querySelector('.login-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}
