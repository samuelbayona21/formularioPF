/**
 * LÓGICA DE LA PÁGINA DE CONFIRMACIÓN
 * Muestra mensaje simple de envío exitoso
 */

document.addEventListener('DOMContentLoaded', function() {
    const nombreCompleto = sessionStorage.getItem('nombre_completo');
    const tiempoAgotado = sessionStorage.getItem('tiempo_agotado') === 'true';
    
    console.log('Tiempo agotado:', tiempoAgotado); // Debug
    console.log('SessionStorage tiempo_agotado:', sessionStorage.getItem('tiempo_agotado')); // Debug
    
    // Actualizar título según el caso
    const titleElement = document.querySelector('.confirmation-title');
    if (tiempoAgotado) {
        titleElement.textContent = 'El tiempo ha finalizado. Tu examen ha sido enviado automáticamente.';
    } else {
        titleElement.textContent = 'Tu respuesta ha sido enviada';
    }
    
    if (nombreCompleto) {
        document.getElementById('studentName').textContent = `Gracias, ${nombreCompleto}`;
    }
    
    // Limpiar sessionStorage después de un pequeño delay
    setTimeout(() => {
        sessionStorage.clear();
    }, 100);
});
