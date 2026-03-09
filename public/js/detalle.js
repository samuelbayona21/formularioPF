/**
 * LÓGICA DE LA PÁGINA DE DETALLE DEL EXAMEN
 * Muestra todas las preguntas con las respuestas del estudiante
 */

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const intentoId = urlParams.get('intento_id');
    
    if (!intentoId) {
        alert('ID de intento no proporcionado');
        window.history.back();
        return;
    }
    
    await loadExamDetails(intentoId);
});

/**
 * Cargar detalles del examen
 */
async function loadExamDetails(intentoId) {
    try {
        const response = await fetch(`/examen_contadores/api/obtener-detalle-examen.php?intento_id=${intentoId}`);
        const data = await response.json();
        
        if (data.success) {
            displayStudentInfo(data.info);
            displayQuestions(data.preguntas);
        } else {
            alert('Error al cargar los detalles');
            window.history.back();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

/**
 * Mostrar información del estudiante
 */
function displayStudentInfo(info) {
    document.getElementById('studentName').textContent = info.nombre_completo;
    document.getElementById('studentCedula').textContent = info.cedula;
    document.getElementById('examDate').textContent = formatDate(info.fecha_fin);
    document.getElementById('percentage').textContent = info.porcentaje + '%';
}

/**
 * Mostrar preguntas y respuestas
 */
function displayQuestions(preguntas) {
    const container = document.getElementById('questionsContainer');
    
    container.innerHTML = preguntas.map(pregunta => {
        const respuestaEstudiante = pregunta.respuesta_seleccionada;
        const respuestaCorrecta = pregunta.respuesta_correcta;
        
        let cardClass = 'unanswered';
        let statusText = 'Sin Responder';
        let statusClass = 'unanswered';
        
        if (respuestaEstudiante) {
            if (respuestaEstudiante === respuestaCorrecta) {
                cardClass = 'correct';
                statusText = '✓ Correcta';
                statusClass = 'correct';
            } else {
                cardClass = 'incorrect';
                statusText = '✗ Incorrecta';
                statusClass = 'incorrect';
            }
        }
        
        const opcionesHTML = pregunta.opciones.map(opcion => {
            const letra = opcion.letra_opcion;
            let optionClass = '';
            let indicator = '';
            
            // Determinar clase y indicador
            if (letra === respuestaCorrecta) {
                optionClass = 'correct-answer';
                indicator = '<span class="option-indicator correct">Correcta</span>';
            }
            
            if (letra === respuestaEstudiante) {
                if (letra === respuestaCorrecta) {
                    optionClass = 'correct-answer student-answer';
                    indicator = '<span class="option-indicator correct">Tu respuesta ✓</span>';
                } else {
                    optionClass = 'wrong-answer';
                    indicator = '<span class="option-indicator wrong">Tu respuesta ✗</span>';
                }
            }
            
            return `
                <div class="option-detail ${optionClass}">
                    <span class="option-letter">${letra}.</span>
                    <span class="option-text-detail">${opcion.texto_opcion}</span>
                    ${indicator}
                </div>
            `;
        }).join('');
        
        return `
            <div class="question-card ${cardClass}">
                <div class="question-header-detail">
                    <span class="question-number-detail">Pregunta ${pregunta.numero_pregunta}</span>
                    <span class="question-status ${statusClass}">${statusText}</span>
                </div>
                <p class="question-text-detail">${pregunta.texto_pregunta}</p>
                <div class="options-list">
                    ${opcionesHTML}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
