/**
 * Servicio: Exportar a PDF
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = {
    primary: [37, 99, 235],      // #2563eb
    primaryLight: [56, 189, 248], // #38bdf8
    dark: [15, 23, 42],           // dark bg
    darkCard: [30, 41, 59],       // dark card
    white: [255, 255, 255],
    gray: [148, 163, 184],
    green: [34, 197, 94],
    red: [239, 68, 68],
    yellow: [234, 179, 8],
};

function addHeader(doc, title) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Fondo del header
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Título
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Prueba de Conocimiento GAF', 14, 11);

    // Subtítulo
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 14, 20);

    // Fecha
    const fecha = new Date().toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Generado: ${fecha}`, pageWidth - 14, 20, { align: 'right' });
}

function addFooter(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(...COLORS.primary);
        doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
        doc.setTextColor(...COLORS.white);
        doc.setFontSize(8);
        doc.text('Sistema de Evaluación GAF - Confidencial', 14, pageHeight - 4);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 4, { align: 'right' });
    }
}

export const pdfService = {
    /**
     * Exportar reporte completo del dashboard
     */
    exportarDashboard(estadisticas, resultados, topResultados) {
        const doc = new jsPDF({ orientation: 'landscape' });
        const pageWidth = doc.internal.pageSize.getWidth();

        addHeader(doc, 'Reporte General de Resultados');

        // ── Estadísticas generales ──
        let y = 36;
        doc.setTextColor(...COLORS.primary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Estadísticas Generales', 14, y);
        y += 6;

        const statsData = [
            ['Total Usuarios', estadisticas.totalUsuarios],
            ['Total Exámenes', estadisticas.totalExamenes],
            ['Aprobados', estadisticas.examenesCompletados],
            ['Reprobados', estadisticas.totalExamenes - estadisticas.examenesCompletados],
            ['Promedio General', `${estadisticas.promedioCalificacion}%`],
        ];

        autoTable(doc, {
            startY: y,
            head: [['Indicador', 'Valor']],
            body: statsData,
            theme: 'grid',
            headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [241, 245, 249] },
            columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'center' } },
            margin: { left: 14, right: pageWidth / 2 + 5 },
        });

        // ── Top 5 ──
        if (topResultados && topResultados.length > 0) {
            const topY = doc.lastAutoTable.finalY > 80 ? doc.lastAutoTable.finalY + 10 : 36;

            doc.setTextColor(...COLORS.primary);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Top 5 Mejores Resultados', pageWidth / 2 + 5, 42);

            autoTable(doc, {
                startY: 48,
                head: [['#', 'Nombre', 'Cédula', 'Porcentaje', 'Correctas', 'Tiempo']],
                body: topResultados.map(r => [
                    r.posicion === 1 ? '🥇 1' : r.posicion === 2 ? '🥈 2' : r.posicion === 3 ? '🥉 3' : r.posicion,
                    r.nombreCompleto,
                    r.cedula,
                    `${r.porcentaje}%`,
                    `${r.respuestasCorrectas}/${r.totalPreguntas}`,
                    r.tiempoFormateado,
                ]),
                theme: 'grid',
                headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [241, 245, 249] },
                columnStyles: {
                    0: { halign: 'center', fontStyle: 'bold' },
                    3: { halign: 'center', fontStyle: 'bold', textColor: COLORS.green },
                    4: { halign: 'center' },
                    5: { halign: 'center' },
                },
                margin: { left: pageWidth / 2 + 5, right: 14 },
            });
        }

        // ── Tabla de todos los resultados ──
        const tableY = Math.max(
            doc.lastAutoTable?.finalY || 0,
            80
        ) + 12;

        doc.setTextColor(...COLORS.primary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalle de Todos los Resultados', 14, tableY);

        autoTable(doc, {
            startY: tableY + 6,
            head: [['Nombre', 'Cédula', 'Porcentaje', 'Correctas', 'Incorrectas', 'Tiempo', 'Fecha', 'Estado']],
            body: resultados.map(r => [
                r.nombreCompleto,
                r.cedula,
                `${Number(r.porcentaje).toFixed(2)}%`,
                r.respuestasCorrectas,
                r.totalPreguntas - r.respuestasCorrectas,
                r.tiempoSegundos ? `${Math.floor(r.tiempoSegundos / 60)}m ${r.tiempoSegundos % 60}s` : '-',
                r.fechaFin ? new Date(r.fechaFin).toLocaleDateString('es-ES') : '-',
                r.porcentaje >= 60 ? 'Aprobado' : 'Reprobado',
            ]),
            theme: 'striped',
            headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [241, 245, 249] },
            columnStyles: {
                2: { halign: 'center', fontStyle: 'bold' },
                3: { halign: 'center' },
                4: { halign: 'center' },
                5: { halign: 'center' },
                6: { halign: 'center' },
                7: {
                    halign: 'center',
                    fontStyle: 'bold',
                },
            },
            didParseCell(data) {
                if (data.column.index === 7 && data.section === 'body') {
                    data.cell.styles.textColor = data.cell.raw === 'Aprobado' ? COLORS.green : COLORS.red;
                }
                if (data.column.index === 2 && data.section === 'body') {
                    const val = parseFloat(data.cell.raw);
                    data.cell.styles.textColor = val >= 60 ? COLORS.green : COLORS.red;
                }
            },
            margin: { left: 14, right: 14 },
        });

        addFooter(doc);

        const fecha = new Date().toISOString().slice(0, 10);
        doc.save(`reporte_gaf_${fecha}.pdf`);
    },

    /**
     * Exportar detalle de un usuario específico
     */
    exportarDetalle(detalle) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        addHeader(doc, `Detalle de Prueba - ${detalle.usuario.nombreCompleto}`);

        // Info del usuario
        let y = 36;
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(14, y, pageWidth - 28, 28, 3, 3, 'F');

        doc.setTextColor(...COLORS.primary);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Usuario:', 20, y + 8);
        doc.text('Cédula:', 20, y + 16);
        doc.text('Fecha:', pageWidth / 2, y + 8);
        doc.text('Porcentaje:', pageWidth / 2, y + 16);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(detalle.usuario.nombreCompleto, 50, y + 8);
        doc.text(detalle.usuario.cedula, 50, y + 16);
        doc.text(new Date(detalle.intento.fechaFin).toLocaleDateString('es-ES'), pageWidth / 2 + 25, y + 8);

        const pct = Number(detalle.intento.porcentaje).toFixed(2);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...(pct >= 60 ? COLORS.green : COLORS.red));
        doc.text(`${pct}%`, pageWidth / 2 + 25, y + 16);

        // Estadísticas
        y += 36;
        autoTable(doc, {
            startY: y,
            head: [['Correctas', 'Incorrectas', 'Total', 'Tiempo']],
            body: [[
                detalle.intento.respuestasCorrectas,
                detalle.intento.totalPreguntas - detalle.intento.respuestasCorrectas,
                detalle.intento.totalPreguntas,
                `${Math.floor(detalle.intento.tiempoSegundos / 60)}m ${detalle.intento.tiempoSegundos % 60}s`,
            ]],
            theme: 'grid',
            headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: 'bold', halign: 'center' },
            bodyStyles: { halign: 'center', fontStyle: 'bold' },
            margin: { left: 14, right: 14 },
        });

        // Respuestas
        y = doc.lastAutoTable.finalY + 10;
        doc.setTextColor(...COLORS.primary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalle de Respuestas', 14, y);

        autoTable(doc, {
            startY: y + 6,
            head: [['#', 'Pregunta', 'Respuesta', 'Correcta', 'Resultado']],
            body: detalle.respuestas.map((r, i) => [
                i + 1,
                r.texto_pregunta.length > 60 ? r.texto_pregunta.substring(0, 60) + '...' : r.texto_pregunta,
                r.respuesta_usuario || 'Sin respuesta',
                r.respuesta_correcta,
                r.es_correcta ? '✓ Correcta' : '✗ Incorrecta',
            ]),
            theme: 'striped',
            headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [241, 245, 249] },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { cellWidth: 100 },
                2: { halign: 'center', cellWidth: 20 },
                3: { halign: 'center', cellWidth: 20 },
                4: { halign: 'center', fontStyle: 'bold', cellWidth: 25 },
            },
            didParseCell(data) {
                if (data.column.index === 4 && data.section === 'body') {
                    data.cell.styles.textColor = data.cell.raw.includes('✓') ? COLORS.green : COLORS.red;
                }
            },
            margin: { left: 14, right: 14 },
        });

        addFooter(doc);

        const nombre = detalle.usuario.nombreCompleto.replace(/\s+/g, '_').toLowerCase();
        doc.save(`resultado_${nombre}.pdf`);
    }
};
