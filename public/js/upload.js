/**
 * LÓGICA PARA CARGA DE PREGUNTAS DESDE CSV
 */

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const csvFileInput = document.getElementById('csvFile');
    const fileNameSpan = document.querySelector('.file-name');
    
    // Actualizar nombre del archivo seleccionado
    csvFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileNameSpan.textContent = this.files[0].name;
        } else {
            fileNameSpan.textContent = 'Ningún archivo seleccionado';
        }
    });
    
    // Manejar envío del formulario
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Deshabilitar botón
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Procesando...';
        
        try {
            const response = await fetch('../../php/cargar_preguntas_csv.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showResult('success', data.message, data.detalles);
                
                // Mostrar vista previa si hay preguntas
                if (data.preguntas) {
                    showPreview(data.preguntas);
                }
                
                // Limpiar formulario
                uploadForm.reset();
                fileNameSpan.textContent = 'Ningún archivo seleccionado';
            } else {
                showResult('error', data.message, data.errores);
            }
        } catch (error) {
            console.error('Error:', error);
            showResult('error', 'Error de conexión al servidor');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '📤 Cargar Preguntas';
        }
    });
});

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
 * Mostrar vista previa de preguntas
 */
function showPreview(preguntas) {
    const container = document.getElementById('previewContainer');
    const content = document.getElementById('previewContent');
    
    let html = '';
    
    preguntas.forEach(pregunta => {
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
    
    content.innerHTML = html;
    container.style.display = 'block';
}
