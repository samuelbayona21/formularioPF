/**
 * LÓGICA PARA CARGA DEL SISTEMA COMPLETO (3 ARCHIVOS CSV)
 */

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadSystemForm');
    const csvPreguntas = document.getElementById('csvPreguntas');
    const csvRespuestas = document.getElementById('csvRespuestas');
    const csvCalificacion = document.getElementById('csvCalificacion');
    
    // Actualizar nombres de archivos seleccionados
    csvPreguntas.addEventListener('change', function() {
        updateFileName(this, 'fileName1');
    });
    
    csvRespuestas.addEventListener('change', function() {
        updateFileName(this, 'fileName2');
    });
    
    csvCalificacion.addEventListener('change', function() {
        updateFileName(this, 'fileName3');
    });
    
    // Manejar envío del formulario
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Validar que se hayan seleccionado los 3 archivos
        if (!csvPreguntas.files[0] || !csvRespuestas.files[0] || !csvCalificacion.files[0]) {
            showResult('error', 'Debes seleccionar los 3 archivos CSV');
            return;
        }
        
        // Deshabilitar botón
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Procesando los 3 archivos...';
        
        try {
            const response = await fetch('../../php/cargar_sistema_completo.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showResult('success', data.message, data.detalles);
                
                // Mostrar vista previa si hay datos
                if (data.preview) {
                    showPreview(data.preview);
                }
                
                // Limpiar formulario
                uploadForm.reset();
                document.getElementById('fileName1').textContent = 'Ningún archivo seleccionado';
                document.getElementById('fileName2').textContent = 'Ningún archivo seleccionado';
                document.getElementById('fileName3').textContent = 'Ningún archivo seleccionado';
            } else {
                showResult('error', data.message, data.errores);
            }
        } catch (error) {
            console.error('Error:', error);
            showResult('error', 'Error de conexión al servidor');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '📦 Cargar Sistema Completo';
        }
    });
});

/**
 * Actualizar nombre del archivo seleccionado
 */
function updateFileName(input, spanId) {
    const span = document.getElementById(spanId);
    if (input.files.length > 0) {
        span.textContent = input.files[0].name;
    } else {
        span.textContent = 'Ningún archivo seleccionado';
    }
}

/**
 * Mostrar resultado de la carga
 */
function showResult(type, message, details = null) {
    const container = document.getElementById('resultContainer');
    const content = document.getElementById('resultContent');
    
    let className = type === 'success' ? 'result-success' : 'result-error';
    let html = `<div class="${className}"><strong>${message}</strong></div>`;
    
    if (details) {
        if (Array.isArray(details)) {
            html += '<div class="result-info"><ul>';
            details.forEach(detail => {
                html += `<li>${detail}</li>`;
            });
            html += '</ul></div>';
        } else if (typeof details === 'object') {
            html += '<div class="result-info">';
            for (let key in details) {
                html += `<p><strong>${key}:</strong> ${details[key]}</p>`;
            }
            html += '</div>';
        }
    }
    
    content.innerHTML = html;
    container.style.display = 'block';
    
    // Scroll al resultado
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Mostrar vista previa del sistema
 */
function showPreview(preview) {
    const container = document.getElementById('previewContainer');
    const content = document.getElementById('previewContent');
    
    let html = '';
    
    // Preguntas
    if (preview.preguntas && preview.preguntas.length > 0) {
        html += '<h3>📝 Preguntas Cargadas</h3>';
        html += `<p><strong>Total:</strong> ${preview.preguntas.length} preguntas</p>`;
        
        preview.preguntas.slice(0, 3).forEach(pregunta => {
            html += `
                <div class="preview-question">
                    <h4>Pregunta ${pregunta.numero}: ${pregunta.texto}</h4>
                    <div class="preview-options">
            `;
            
            pregunta.opciones.forEach(opcion => {
                const isCorrect = opcion.letra === pregunta.respuesta_correcta;
                const className = isCorrect ? 'correct' : '';
                const indicator = isCorrect ? ' ✓ (Correcta)' : '';
                
                html += `<div class="${className}">${opcion.letra}. ${opcion.texto}${indicator}</div>`;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        if (preview.preguntas.length > 3) {
            html += `<p><em>... y ${preview.preguntas.length - 3} preguntas más</em></p>`;
        }
    }
    
    // Rangos de calificación
    if (preview.rangos && preview.rangos.length > 0) {
        html += '<h3>🏆 Rangos de Calificación</h3>';
        html += '<table class="results-table"><thead><tr><th>Rango</th><th>Calificación</th><th>Descripción</th></tr></thead><tbody>';
        
        preview.rangos.forEach(rango => {
            html += `
                <tr>
                    <td>${rango.rango_min}% - ${rango.rango_max}%</td>
                    <td><strong>${rango.calificacion}</strong></td>
                    <td>${rango.descripcion}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
    }
    
    content.innerHTML = html;
    container.style.display = 'block';
}
