/**
 * DETALLE DEL EXAMEN - VERSIÓN MODERNA
 */

// Verificar autenticación
if (sessionStorage.getItem('admin_authenticated') !== 'true') {
    window.location.href = 'login.html';
}

let allQuestions = [];

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const intentoId = urlParams.get('intento_id');
    
    if (!intentoId) {
        alert('No se especificó el ID del intento');
        window.history.back();
        return;
    }
    
    await loadExamDetail(intentoId);
});

/**
 * Cargar detalle del examen
 */
async function loadExamDetail(intentoId) {
    try {
        const response = await fetch(`/examen_contadores/api/obtener-detalle-examen.php?intento_id=${intentoId}`);
        const data = await response.json();
        
        if (data.success) {
            allQuestions = data.respuestas;
            displayStudentInfo(data.intento, data.respuestas);
            displayNavigationPanel(data.respuestas);
            displayQuestions(data.respuestas);
        } else {
            showError(data.message || 'No se pudo cargar el detalle del examen');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error de conexión');
    }
}

/**
 * Mostrar panel de navegación
 */
function displayNavigationPanel(preguntas) {
    const navGrid = document.getElementById('navigationGrid');
    const navProgress = document.getElementById('navProgress');
    
    const respondidas = preguntas.filter(p => p.respuesta_seleccionada).length;
    navProgress.textContent = `${respondidas}/${preguntas.length}`;
    
    navGrid.innerHTML = preguntas.map((pregunta, index) => {
        const isCorrect = pregunta.respuesta_seleccionada === pregunta.respuesta_correcta;
        const hasAnswer = pregunta.respuesta_seleccionada !== null && pregunta.respuesta_seleccionada !== '';
        
        let statusClass = 'unanswered';
        if (hasAnswer) {
            statusClass = isCorrect ? 'correct' : 'incorrect';
        }
        
        return `
            <div class="nav-item ${statusClass}" 
                 data-question="${index}" 
                 onclick="scrollToQuestion(${index}); return false;"
                 title="Pregunta ${pregunta.numero_pregunta}">
                ${pregunta.numero_pregunta}
            </div>
        `;
    }).join('');
}

/**
 * Scroll a una pregunta específica
 */
function scrollToQuestion(index) {
    // Prevenir comportamiento por defecto
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const questionCards = document.querySelectorAll('.question-card');
    const mainContent = document.querySelector('.main-content');
    
    if (!questionCards[index] || !mainContent) return false;
    
    // Remover clase active de todos
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al seleccionado
    const navItem = document.querySelector(`.nav-item[data-question="${index}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Obtener posición de la tarjeta relativa al contenedor
    const card = questionCards[index];
    const cardRect = card.getBoundingClientRect();
    const containerRect = mainContent.getBoundingClientRect();
    
    // Calcular el scroll necesario
    const scrollTop = mainContent.scrollTop;
    const targetScroll = scrollTop + (cardRect.top - containerRect.top) - 20;
    
    // Hacer scroll solo en el contenedor
    mainContent.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
    });
    
    return false;
}

/**
 * Observador de intersección para actualizar navegación activa
 */
function setupIntersectionObserver() {
    const options = {
        root: document.querySelector('.main-content'),
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = entry.target.dataset.questionIndex;
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                const navItem = document.querySelector(`.nav-item[data-question="${index}"]`);
                if (navItem) {
                    navItem.classList.add('active');
                }
            }
        });
    }, options);
    
    document.querySelectorAll('.question-card').forEach(card => {
        observer.observe(card);
    });
}

/**
 * Mostrar información del estudiante
 */
function displayStudentInfo(info, preguntas) {
    document.getElementById('studentName').textContent = info.nombre_completo;
    document.getElementById('studentCedula').textContent = info.cedula;
    document.getElementById('examDate').textContent = formatDate(info.fecha_fin);
    document.getElementById('percentage').textContent = info.porcentaje + '%';
    
    // Calcular estadísticas
    const totalQuestions = preguntas.length;
    const correctAnswers = parseInt(info.respuestas_correctas) || 0;
    const incorrectAnswers = parseInt(info.respuestas_incorrectas) || 0;
    const unansweredQuestions = totalQuestions - (correctAnswers + incorrectAnswers);
    
    // Actualizar estadísticas en el DOM
    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('incorrectAnswers').textContent = incorrectAnswers;
    document.getElementById('unansweredQuestions').textContent = unansweredQuestions;
    document.getElementById('totalQuestions').textContent = totalQuestions;
}

/**
 * Mostrar preguntas y respuestas
 */
function displayQuestions(preguntas) {
    const container = document.getElementById('questionsContainer');
    
    if (preguntas.length === 0) {
        container.innerHTML = '<div class="loading-state"><p>No hay preguntas disponibles</p></div>';
        return;
    }
    
    container.innerHTML = preguntas.map((pregunta, index) => {
        // Verificar si hay respuesta seleccionada (más robusto)
        const respuestaSeleccionada = pregunta.respuesta_seleccionada;
        const hasAnswer = respuestaSeleccionada && respuestaSeleccionada.trim() !== '';
        const isCorrect = hasAnswer && respuestaSeleccionada === pregunta.respuesta_correcta;
        
        let statusClass, statusText;
        
        if (!hasAnswer) {
            statusClass = 'unanswered';
            statusText = 'No Respondida';
        } else if (isCorrect) {
            statusClass = 'correct';
            statusText = 'Correcta';
        } else {
            statusClass = 'incorrect';
            statusText = 'Incorrecta';
        }
        
        return `
            <div class="question-card ${statusClass}" data-question-index="${index}" id="question-${index}">
                <div class="question-header">
                    <span class="question-number">Pregunta ${pregunta.numero_pregunta}</span>
                    <span class="question-status ${statusClass}">${statusText}</span>
                </div>
                
                <div class="question-text">
                    ${pregunta.texto_pregunta}
                </div>
                
                <div class="options-list">
                    ${pregunta.opciones.map(opcion => {
                        const isSelected = opcion.letra_opcion === respuestaSeleccionada;
                        const isCorrectOption = opcion.letra_opcion === pregunta.respuesta_correcta;
                        
                        let optionClass = '';
                        let badge = '';
                        
                        if (isSelected && isCorrectOption) {
                            // Respuesta seleccionada y es correcta
                            optionClass = 'correct selected';
                            badge = '<span class="option-badge correct">Respuesta Seleccionada - Correcta</span>';
                        } else if (isSelected && !isCorrectOption) {
                            // Respuesta seleccionada pero es incorrecta
                            optionClass = 'incorrect selected';
                            badge = '<span class="option-badge incorrect">Respuesta Seleccionada - Incorrecta</span>';
                        } else if (!isSelected && isCorrectOption) {
                            // No seleccionada pero es la correcta
                            optionClass = 'correct';
                            badge = '<span class="option-badge correct">Respuesta Correcta</span>';
                        }
                        
                        return `
                            <div class="option-item ${optionClass}">
                                <div class="option-letter">${opcion.letra_opcion}</div>
                                <div class="option-text">${opcion.texto_opcion}</div>
                                ${badge}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    // Configurar observador después de renderizar
    setTimeout(() => setupIntersectionObserver(), 100);
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

/**
 * Mostrar error
 */
function showError(message) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = `
        <div class="loading-state">
            <p style="color: var(--accent-red);">${message}</p>
        </div>
    `;
}
