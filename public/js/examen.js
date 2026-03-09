/**
 * LÓGICA PRINCIPAL DEL EXAMEN
 * Maneja el temporizador, navegación, guardado automático y finalización
 */

let currentQuestion = 1;
let totalQuestions = 20;
let questions = [];
let answers = {};
let timerInterval;
let timeRemaining = 1500; // (25 minutos)
let intentoId;
let examFinished = false; // Flag para controlar si el examen ya finalizó
let tiempoInicio; // Timestamp de inicio del examen

document.addEventListener('DOMContentLoaded', async function() {
    // Verificar que el usuario haya iniciado sesión
    intentoId = sessionStorage.getItem('intento_id');
    const nombreCompleto = sessionStorage.getItem('nombre_completo');
    
    if (!intentoId || !nombreCompleto) {
        alert('Debe iniciar sesión primero');
        window.location.href = '../index.html';
        return;
    }
    
    // Mostrar información del estudiante
    document.getElementById('studentName').textContent = nombreCompleto;
    document.getElementById('examDate').textContent = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Cargar preguntas
    await loadQuestions();
    
    // Cargar tiempo transcurrido
    await loadExamTime();
    
    // Inicializar interfaz
    initializeQuestionGrid();
    displayQuestion(currentQuestion);
    updateProgress();
    
    // Iniciar temporizador
    startTimer();
    
    // Guardar tiempo cada 5 segundos
    setInterval(saveExamTime, 5000);
    
    // Event listeners
    document.getElementById('btnPrevious').addEventListener('click', previousQuestion);
    document.getElementById('btnNext').addEventListener('click', nextQuestion);
    document.getElementById('btnFinish').addEventListener('click', showFinishModal);
    document.getElementById('btnCancelFinish').addEventListener('click', hideFinishModal);
    document.getElementById('btnConfirmFinish').addEventListener('click', () => finishExam(false));
    
    // Prevenir salida accidental SOLO si el examen no ha finalizado
    window.addEventListener('beforeunload', function(e) {
        if (!examFinished) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});

/**
 * Cargar tiempo transcurrido del examen
 */
async function loadExamTime() {
    try {
        const response = await fetch(`/examen_contadores/api/obtener-tiempo.php?intento_id=${intentoId}`);
        const data = await response.json();
        
        if (data.success && data.tiempo_transcurrido) {
            const tiempoTranscurrido = parseInt(data.tiempo_transcurrido);
            const tiempoTotal = 1500; // 25 minutos
            timeRemaining = tiempoTotal - tiempoTranscurrido;
            
            // Si el tiempo ya se agotó
            if (timeRemaining <= 0) {
                timeRemaining = 0;
                finishExam(true);
            }
        }
    } catch (error) {
        console.error('Error al cargar tiempo:', error);
    }
}

/**
 * Guardar tiempo transcurrido
 */
async function saveExamTime() {
    if (examFinished) return;
    
    const tiempoTotal = 1500;
    const tiempoTranscurrido = tiempoTotal - timeRemaining;
    
    try {
        await fetch('/examen_contadores/api/guardar-tiempo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                intento_id: intentoId,
                tiempo_transcurrido: tiempoTranscurrido
            })
        });
    } catch (error) {
        console.error('Error al guardar tiempo:', error);
    }
}

/**
 * Cargar preguntas desde el servidor
 */
async function loadQuestions() {
    try {
        const response = await fetch('/examen_contadores/api/obtener-preguntas.php?examen_id=1');
        const data = await response.json();
        
        if (data.success) {
            questions = data.preguntas;
            totalQuestions = questions.length;
            document.getElementById('totalQuestions').textContent = totalQuestions;
            
            // Cargar respuestas guardadas
            await loadSavedAnswers();
        } else {
            alert('Error al cargar las preguntas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

/**
 * Cargar respuestas previamente guardadas
 */
async function loadSavedAnswers() {
    try {
        const response = await fetch(`/examen_contadores/api/obtener-respuestas.php?intento_id=${intentoId}`);
        const data = await response.json();
        
        if (data.success && data.respuestas) {
            data.respuestas.forEach(resp => {
                answers[resp.pregunta_id] = resp.respuesta_seleccionada;
            });
        }
    } catch (error) {
        console.error('Error al cargar respuestas:', error);
    }
}

/**
 * Inicializar la cuadrícula de navegación de preguntas
 */
function initializeQuestionGrid() {
    const grid = document.getElementById('questionsGrid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= totalQuestions; i++) {
        const btn = document.createElement('button');
        btn.className = 'question-number';
        btn.textContent = i;
        btn.dataset.question = i;
        btn.addEventListener('click', () => goToQuestion(i));
        grid.appendChild(btn);
    }
}

/**
 * Mostrar una pregunta específica
 */
function displayQuestion(questionNumber) {
    currentQuestion = questionNumber;
    const question = questions[questionNumber - 1];
    
    if (!question) return;
    
    // Actualizar número de pregunta
    document.getElementById('currentQuestionNumber').textContent = questionNumber;
    
    // Mostrar texto de la pregunta
    document.getElementById('questionText').textContent = question.texto_pregunta;
    
    // Mostrar opciones
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.opciones.forEach(opcion => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        
        const savedAnswer = answers[question.id];
        if (savedAnswer === opcion.letra_opcion) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <input type="radio" 
                   name="answer" 
                   id="option${opcion.letra_opcion}" 
                   value="${opcion.letra_opcion}"
                   ${savedAnswer === opcion.letra_opcion ? 'checked' : ''}>
            <label for="option${opcion.letra_opcion}" class="option-label">
                <strong>${opcion.letra_opcion}.</strong> ${opcion.texto_opcion}
            </label>
        `;
        
        // Event listener para selección
        optionDiv.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            selectAnswer(opcion.letra_opcion);
        });
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Actualizar botones de navegación
    updateNavigationButtons();
    
    // Actualizar grid de preguntas
    updateQuestionGrid();
}

/**
 * Seleccionar una respuesta
 */
async function selectAnswer(letter) {
    const question = questions[currentQuestion - 1];
    
    // Actualizar visualmente
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelector(`#option${letter}`).parentElement.classList.add('selected');
    
    // Guardar en memoria
    answers[question.id] = letter;
    
    // Guardar en base de datos
    await saveAnswer(question.id, letter);
    
    // Actualizar progreso
    updateProgress();
    updateQuestionGrid();
}

/**
 * Guardar respuesta en la base de datos
 */
async function saveAnswer(preguntaId, respuesta) {
    try {
        const response = await fetch('/examen_contadores/api/guardar-respuesta.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                intento_id: intentoId,
                pregunta_id: preguntaId,
                respuesta: respuesta
            })
        });
        
        const data = await response.json();
        if (!data.success) {
            console.error('Error al guardar respuesta');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Actualizar barra de progreso
 */
function updateProgress() {
    const answeredCount = Object.keys(answers).length;
    const percentage = Math.round((answeredCount / totalQuestions) * 100);
    
    document.getElementById('progressText').textContent = `${answeredCount}/${totalQuestions}`;
    document.getElementById('progressPercentage').textContent = `${percentage}%`;
    document.getElementById('progressFill').style.width = `${percentage}%`;
}

/**
 * Actualizar grid de navegación
 */
function updateQuestionGrid() {
    const buttons = document.querySelectorAll('.question-number');
    buttons.forEach((btn, index) => {
        const questionNum = index + 1;
        const question = questions[index];
        
        btn.classList.remove('answered', 'current');
        
        if (questionNum === currentQuestion) {
            btn.classList.add('current');
        } else if (answers[question.id]) {
            btn.classList.add('answered');
        }
    });
}

/**
 * Actualizar botones de navegación
 */
function updateNavigationButtons() {
    const btnPrevious = document.getElementById('btnPrevious');
    const btnNext = document.getElementById('btnNext');
    const btnFinish = document.getElementById('btnFinish');
    
    btnPrevious.disabled = currentQuestion === 1;
    btnNext.disabled = currentQuestion === totalQuestions;
    
    if (currentQuestion === totalQuestions) {
        btnFinish.style.display = 'block';
    } else {
        btnFinish.style.display = 'none';
    }
}

/**
 * Ir a pregunta anterior
 */
function previousQuestion() {
    if (currentQuestion > 1) {
        displayQuestion(currentQuestion - 1);
    }
}

/**
 * Ir a pregunta siguiente
 */
function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        displayQuestion(currentQuestion + 1);
    }
}

/**
 * Ir a una pregunta específica
 */
function goToQuestion(questionNumber) {
    displayQuestion(questionNumber);
}

/**
 * Iniciar temporizador
 */
function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        // Advertencia a los 5 minutos
        if (timeRemaining === 300) {
            document.getElementById('timer').classList.add('warning');
            alert('¡Atención! Quedan 5 minutos para finalizar el examen.');
        }
        
        // Tiempo agotado
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishExam(true);
        }
    }, 1000);
}

/**
 * Actualizar visualización del temporizador
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').textContent = display;
}

/**
 * Mostrar modal de confirmación
 */
function showFinishModal() {
    const answeredCount = Object.keys(answers).length;
    const pendingCount = totalQuestions - answeredCount;
    
    document.getElementById('modalAnswered').textContent = answeredCount;
    document.getElementById('modalTotal').textContent = totalQuestions;
    document.getElementById('modalPending').textContent = pendingCount;
    document.getElementById('finishModal').classList.add('active');
}

/**
 * Ocultar modal de confirmación
 */
function hideFinishModal() {
    document.getElementById('finishModal').classList.remove('active');
}

/**
 * Finalizar examen
 */
async function finishExam(timeExpired = false) {
    // Marcar el examen como finalizado para evitar el mensaje de salida
    examFinished = true;
    
    clearInterval(timerInterval);
    
    // Ocultar modal si está abierto
    hideFinishModal();
    
    try {
        const response = await fetch('/examen_contadores/api/finalizar-examen.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                intento_id: intentoId,
                tiempo_agotado: timeExpired
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar resultado y tipo de finalización
            sessionStorage.setItem('resultado', JSON.stringify(data.resultado));
            sessionStorage.setItem('tiempo_agotado', timeExpired ? 'true' : 'false');
            
            // Redirigir a página de resultados sin mostrar alert
            window.location.href = 'resultado.html';
        } else {
            examFinished = false; // Revertir si hay error
            alert('Error al finalizar el examen: ' + (data.message || 'Error desconocido'));
        }
    } catch (error) {
        examFinished = false; // Revertir si hay error
        console.error('Error:', error);
        alert('Error de conexión al finalizar el examen');
    }
}
