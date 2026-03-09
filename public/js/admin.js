/**
 * LÓGICA DEL DASHBOARD ADMINISTRATIVO
 * Muestra todos los resultados de los estudiantes
 */

let allResults = [];

document.addEventListener('DOMContentLoaded', async function() {
    await loadResults();
    
    // Event listener para el buscador
    document.getElementById('searchInput').addEventListener('input', filterResults);
});

/**
 * Cargar todos los resultados
 */
async function loadResults() {
    try {
        const response = await fetch('../../api/obtener-todos-resultados.php');
        const data = await response.json();
        
        if (data.success) {
            allResults = data.resultados;
            displayResults(allResults);
            updateStatistics(allResults);
        } else {
            showNoData();
        }
    } catch (error) {
        console.error('Error:', error);
        showError();
    }
}

/**
 * Mostrar resultados en la tabla
 */
function displayResults(results) {
    const tbody = document.getElementById('resultsTableBody');
    
    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">No hay resultados disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = results.map(result => {
        const porcentaje = parseFloat(result.porcentaje);
        const estado = porcentaje >= 60 ? 'approved' : 'failed';
        const estadoTexto = porcentaje >= 60 ? 'Aprobado' : 'Reprobado';
        
        return `
            <tr>
                <td>${result.nombre_completo}</td>
                <td>${result.cedula}</td>
                <td><strong>${result.porcentaje}%</strong></td>
                <td class="success">${result.respuestas_correctas}</td>
                <td class="error">${result.respuestas_incorrectas}</td>
                <td>${formatDate(result.fecha_fin)}</td>
                <td><span class="status-badge ${estado}">${estadoTexto}</span></td>
                <td>
                    <button class="btn-view" onclick="viewDetails(${result.intento_id})">
                        Ver Detalle
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Actualizar estadísticas
 */
function updateStatistics(results) {
    const total = results.length;
    const aprobados = results.filter(r => parseFloat(r.porcentaje) >= 60).length;
    const reprobados = total - aprobados;
    const promedio = total > 0 
        ? (results.reduce((sum, r) => sum + parseFloat(r.porcentaje), 0) / total).toFixed(2)
        : 0;
    
    document.getElementById('totalStudents').textContent = total;
    document.getElementById('totalApproved').textContent = aprobados;
    document.getElementById('totalFailed').textContent = reprobados;
    document.getElementById('averageScore').textContent = promedio + '%';
}

/**
 * Filtrar resultados por búsqueda
 */
function filterResults() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = allResults.filter(result => {
        return result.nombre_completo.toLowerCase().includes(searchTerm) ||
               result.cedula.toLowerCase().includes(searchTerm);
    });
    
    displayResults(filtered);
}

/**
 * Ver detalle de un examen
 */
function viewDetails(intentoId) {
    window.location.href = `detalle.html?intento_id=${intentoId}`;
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Mostrar mensaje de sin datos
 */
function showNoData() {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">No hay resultados disponibles</td></tr>';
}

/**
 * Mostrar mensaje de error
 */
function showError() {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">Error al cargar los datos</td></tr>';
}
