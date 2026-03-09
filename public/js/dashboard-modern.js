/**
 * DASHBOARD ADMINISTRATIVO MODERNO
 */

// Verificar autenticación
if (sessionStorage.getItem('admin_authenticated') !== 'true') {
    window.location.href = 'login.html';
}

let allResults = [];
let filteredResults = [];
let currentSort = {
    column: 'fecha',
    direction: 'desc'
};

document.addEventListener('DOMContentLoaded', async function() {
    await loadResults();
    setupSearch();
});

/**
 * Cargar resultados
 */
async function loadResults() {
    try {
        const response = await fetch('/examen_contadores/api/obtener-todos-resultados.php');
        const data = await response.json();
        
        if (data.success) {
            allResults = data.resultados;
            filteredResults = [...allResults];
            sortResults(currentSort.column, currentSort.direction);
            displayResults(filteredResults);
            updateStats(allResults);
        } else {
            showError('No se pudieron cargar los resultados');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error de conexión');
    }
}

/**
 * Mostrar resultados en la tabla
 */
function displayResults(results) {
    const tbody = document.getElementById('resultsTableBody');
    const recordCount = document.getElementById('recordCount');
    
    // Actualizar contador
    recordCount.textContent = `${results.length} registro${results.length !== 1 ? 's' : ''}`;
    
    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="loading">No hay resultados disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = results.map(result => {
        const porcentaje = parseFloat(result.porcentaje);
        const estado = porcentaje >= 60 ? 'approved' : 'failed';
        const estadoTexto = estado === 'approved' ? 'Aprobado' : 'Reprobado';
        
        const correctas = parseInt(result.correctas) || 0;
        const incorrectas = parseInt(result.incorrectas) || 0;
        const totalPreguntas = parseInt(result.total_preguntas) || 50;
        const noRespondidas = totalPreguntas - (correctas + incorrectas);
        
        const correctasPercent = (correctas / totalPreguntas * 100).toFixed(1);
        const incorrectasPercent = (incorrectas / totalPreguntas * 100).toFixed(1);
        const noRespondidasPercent = (noRespondidas / totalPreguntas * 100).toFixed(1);
        
        return `
            <tr>
                <td>${result.nombre_completo}</td>
                <td>${result.cedula}</td>
                <td><strong>${result.porcentaje}%</strong></td>
                <td>
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress-correct" style="width: ${correctasPercent}%"></div>
                            <div class="progress-incorrect" style="width: ${incorrectasPercent}%"></div>
                            <div class="progress-unanswered" style="width: ${noRespondidasPercent}%"></div>
                        </div>
                        <span class="progress-label">${correctas + incorrectas}/${totalPreguntas}</span>
                    </div>
                </td>
                <td style="text-align: center;">${correctas}</td>
                <td style="text-align: center;">${incorrectas}</td>
                <td>
                    <span class="time-badge">${formatTime(result.tiempo_segundos)}</span>
                </td>
                <td>${formatDate(result.fecha)}</td>
                <td style="text-align: center;">
                    <a href="detalle.html?intento_id=${result.intento_id}" class="btn-detail">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.5 1.5C3.5 1.5 1 4 1 6.5C1 9 3.5 11.5 6.5 11.5C9.5 11.5 12 9 12 6.5C12 4 9.5 1.5 6.5 1.5ZM6.5 9.5C4.84315 9.5 3.5 8.15685 3.5 6.5C3.5 4.84315 4.84315 3.5 6.5 3.5C8.15685 3.5 9.5 4.84315 9.5 6.5C9.5 8.15685 8.15685 9.5 6.5 9.5Z" fill="currentColor"/>
                        </svg>
                        Ver
                    </a>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Actualizar estadísticas
 */
function updateStats(results) {
    const total = results.length;
    const aprobados = results.filter(r => parseFloat(r.porcentaje) >= 60).length;
    const reprobados = total - aprobados;
    const promedio = total > 0 
        ? (results.reduce((sum, r) => sum + parseFloat(r.porcentaje), 0) / total).toFixed(1)
        : 0;
    
    document.getElementById('totalStudents').textContent = total;
    document.getElementById('totalApproved').textContent = aprobados;
    document.getElementById('totalFailed').textContent = reprobados;
    document.getElementById('averageScore').textContent = promedio + '%';
    
    // Actualizar TOP 10
    displayTop10(results);
}

/**
 * Mostrar TOP 10
 */
function displayTop10(results) {
    const top10Container = document.getElementById('top10List');
    
    // Ordenar por porcentaje descendente y tomar los primeros 10
    const top10 = [...results]
        .sort((a, b) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje))
        .slice(0, 10);
    
    if (top10.length === 0) {
        top10Container.innerHTML = '<div class="top10-empty">No hay resultados disponibles</div>';
        return;
    }
    
    top10Container.innerHTML = top10.map((result, index) => {
        const porcentaje = parseFloat(result.porcentaje);
        const posicion = `${index + 1}°`;
        const colorClass = porcentaje >= 90 ? 'excellent' : porcentaje >= 80 ? 'great' : porcentaje >= 70 ? 'good' : 'pass';
        
        // Extraer primer nombre y primer apellido
        const nombrePartes = result.nombre_completo.trim().split(' ');
        const nombreCorto = nombrePartes.length > 1 
            ? `${nombrePartes[0]} ${nombrePartes[nombrePartes.length - 1]}`
            : nombrePartes[0];
        
        return `
            <div class="top10-item ${colorClass}" onclick="verDetalle(${result.intento_id})">
                <span class="top10-rank">${posicion}</span>
                <span class="top10-name" title="${result.nombre_completo}">${nombreCorto}</span>
                <span class="top10-score">${result.porcentaje}%</span>
                <span class="top10-info">${result.correctas}/${result.total_preguntas}</span>
            </div>
        `;
    }).join('');
}

/**
 * Configurar búsqueda
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    searchInput.addEventListener('input', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
}

/**
 * Aplicar filtros
 */
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const dateValue = document.getElementById('dateFilter').value;
    const statusValue = document.getElementById('statusFilter').value;
    
    let filtered = allResults;
    
    // Filtrar por texto
    if (searchTerm !== '') {
        filtered = filtered.filter(result => 
            result.nombre_completo.toLowerCase().includes(searchTerm) ||
            result.cedula.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtrar por fecha
    if (dateValue !== '') {
        filtered = filtered.filter(result => {
            if (!result.fecha) return false;
            const resultDate = result.fecha.split(' ')[0];
            return resultDate === dateValue;
        });
    }
    
    // Filtrar por estado
    if (statusValue !== 'all') {
        filtered = filtered.filter(result => {
            const porcentaje = parseFloat(result.porcentaje);
            if (statusValue === 'approved') {
                return porcentaje >= 60;
            } else if (statusValue === 'failed') {
                return porcentaje < 60;
            }
            return true;
        });
    }
    
    filteredResults = filtered;
    sortResults(currentSort.column, currentSort.direction);
    displayResults(filteredResults);
}

/**
 * Limpiar filtros
 */
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('statusFilter').value = 'all';
    filteredResults = [...allResults];
    sortResults(currentSort.column, currentSort.direction);
    displayResults(filteredResults);
}

/**
 * Ordenar tabla
 */
function sortTable(column) {
    // Prevenir scroll de la página
    event.preventDefault();
    
    // Si es la misma columna, cambiar dirección
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'desc';
    }
    
    sortResults(column, currentSort.direction);
    displayResults(filteredResults);
    updateSortIcons();
}

/**
 * Ordenar resultados
 */
function sortResults(column, direction) {
    filteredResults.sort((a, b) => {
        let valueA, valueB;
        
        switch(column) {
            case 'porcentaje':
            case 'correctas':
            case 'incorrectas':
            case 'tiempo_segundos':
                valueA = parseFloat(a[column]) || 0;
                valueB = parseFloat(b[column]) || 0;
                break;
            case 'fecha':
                valueA = new Date(a[column] || 0);
                valueB = new Date(b[column] || 0);
                break;
            default:
                valueA = (a[column] || '').toString().toLowerCase();
                valueB = (b[column] || '').toString().toLowerCase();
        }
        
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Actualizar iconos de ordenamiento
 */
function updateSortIcons() {
    // Limpiar todos los iconos
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.className = 'sort-icon';
    });
    
    // Agregar clase al icono activo
    const headers = document.querySelectorAll('th.sortable');
    headers.forEach(header => {
        const onclick = header.getAttribute('onclick');
        if (onclick && onclick.includes(`'${currentSort.column}'`)) {
            const icon = header.querySelector('.sort-icon');
            icon.className = `sort-icon ${currentSort.direction}`;
        }
    });
}

/**
 * Formatear tiempo en minutos y segundos
 */
function formatTime(seconds) {
    if (!seconds || seconds < 0) return '-';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString.replace(' ', 'T'));
    
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Mostrar error
 */
function showError(message) {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = `<tr><td colspan="9" class="loading" style="color: var(--accent-red);">${message}</td></tr>`;
}

/**
 * Cerrar sesión
 */
function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        sessionStorage.removeItem('admin_authenticated');
        sessionStorage.removeItem('admin_username');
        window.location.href = 'login.html';
    }
}

/**
 * Ver detalle del examen
 */
function verDetalle(intentoId) {
    window.location.href = `detalle.html?intento_id=${intentoId}`;
}
