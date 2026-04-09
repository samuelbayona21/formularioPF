/**
 * Servicio: Exportar a PDF
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PRIMARY      = [37, 99, 235];
const PRIMARY_DARK = [29, 78, 216];
const WHITE        = [255, 255, 255];
const GRAY_LIGHT   = [241, 245, 249];
const GRAY_TEXT    = [100, 116, 139];
const GREEN        = [22, 163, 74];
const RED          = [220, 38, 38];
const GOLD         = [161, 120, 0];
const SILVER       = [100, 116, 139];
const BRONZE       = [154, 90, 30];
const DARK         = [15, 23, 42];

function addHeader(doc, title, subtitle = '') {
    const W = doc.internal.pageSize.getWidth();
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, 18, 'F');
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 18, W, 14, 'F');
    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('SISTEMA DE EVALUACION GAF', 14, 12);
    const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(fecha, W - 14, 12, { align: 'right' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 14, 29);
    if (subtitle) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(subtitle, W - 14, 29, { align: 'right' });
    }
}

function addFooter(doc) {
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const total = doc.internal.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(0.5);
        doc.line(14, H - 14, W - 14, H - 14);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...GRAY_TEXT);
        doc.text('Documento confidencial - Prueba de Conocimiento GAF', 14, H - 7);
        doc.text(`Pagina ${i} de ${total}`, W - 14, H - 7, { align: 'right' });
    }
}

function medalLabel(pos) {
    if (pos === 1) return '1er Lugar';
    if (pos === 2) return '2do Lugar';
    if (pos === 3) return '3er Lugar';
    return `${pos}to Lugar`;
}

function medalColor(pos) {
    if (pos === 1) return GOLD;
    if (pos === 2) return SILVER;
    if (pos === 3) return BRONZE;
    return PRIMARY;
}

export const pdfService = {

    exportarDashboard(estadisticas, resultados, topResultados) {
        const doc = new jsPDF({ orientation: 'portrait' });
        const W = doc.internal.pageSize.getWidth();

        addHeader(doc, 'Reporte General de Resultados', `Total registros: ${resultados.length}`);

        let y = 42;

        // Estadísticas generales
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...PRIMARY_DARK);
        doc.text('ESTADISTICAS GENERALES', 14, y);
        y += 4;
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(0.4);
        doc.line(14, y, W - 14, y);
        y += 5;

        const cardW = (W - 28 - 9) / 4;
        const cards = [
            { label: 'Total Usuarios',  value: estadisticas.totalUsuarios,                                          color: PRIMARY },
            { label: 'Aprobados',       value: estadisticas.examenesCompletados,                                    color: GREEN },
            { label: 'Reprobados',      value: estadisticas.totalExamenes - estadisticas.examenesCompletados,       color: RED },
            { label: 'Promedio',        value: `${estadisticas.promedioCalificacion}%`,                             color: PRIMARY_DARK },
        ];

        cards.forEach((card, i) => {
            const x = 14 + i * (cardW + 3);
            doc.setFillColor(...GRAY_LIGHT);
            doc.roundedRect(x, y, cardW, 18, 2, 2, 'F');
            doc.setDrawColor(...card.color);
            doc.setLineWidth(0.8);
            doc.line(x, y, x, y + 18);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...card.color);
            doc.text(String(card.value), x + cardW / 2, y + 11, { align: 'center' });
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...GRAY_TEXT);
            doc.text(card.label.toUpperCase(), x + cardW / 2, y + 16, { align: 'center' });
        });

        y += 26;

        // Top 5
        if (topResultados && topResultados.length > 0) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...PRIMARY_DARK);
            doc.text('TOP 5 MEJORES RESULTADOS', 14, y);
            y += 4;
            doc.setDrawColor(...PRIMARY);
            doc.setLineWidth(0.4);
            doc.line(14, y, W - 14, y);
            y += 3;

            autoTable(doc, {
                startY: y,
                head: [['Posicion', 'Nombre Completo', 'Cedula', 'Porcentaje', 'Correctas', 'Tiempo']],
                body: topResultados.map(r => [
                    medalLabel(r.posicion),
                    r.nombreCompleto,
                    r.cedula,
                    `${r.porcentaje}%`,
                    `${r.respuestasCorrectas} / ${r.totalPreguntas}`,
                    r.tiempoFormateado,
                ]),
                theme: 'plain',
                headStyles: { fillColor: PRIMARY_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 8, cellPadding: 4 },
                bodyStyles: { fontSize: 8.5, cellPadding: 4 },
                alternateRowStyles: { fillColor: GRAY_LIGHT },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 22 },
                    1: { cellWidth: 60 },
                    2: { cellWidth: 28, halign: 'center' },
                    3: { halign: 'center', fontStyle: 'bold' },
                    4: { halign: 'center' },
                    5: { halign: 'center' },
                },
                didParseCell(data) {
                    if (data.section === 'body') {
                        if (data.column.index === 0) {
                            data.cell.styles.textColor = medalColor(topResultados[data.row.index]?.posicion);
                        }
                        if (data.column.index === 3) {
                            data.cell.styles.textColor = parseFloat(data.cell.raw) >= 60 ? GREEN : RED;
                        }
                    }
                },
                margin: { left: 14, right: 14 },
            });

            y = doc.lastAutoTable.finalY + 10;
        }

        // Tabla completa
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...PRIMARY_DARK);
        doc.text('DETALLE DE TODOS LOS RESULTADOS', 14, y);
        y += 4;
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(0.4);
        doc.line(14, y, W - 14, y);
        y += 3;

        autoTable(doc, {
            startY: y,
            head: [['Nombre', 'Cedula', '%', 'Correctas', 'Tiempo', 'Fecha', 'Estado']],
            body: resultados.map(r => [
                r.nombreCompleto,
                r.cedula,
                `${Number(r.porcentaje).toFixed(1)}%`,
                `${r.respuestasCorrectas}/${r.totalPreguntas}`,
                r.tiempoSegundos ? `${Math.floor(r.tiempoSegundos / 60)}m ${r.tiempoSegundos % 60}s` : '-',
                r.fechaFin ? new Date(r.fechaFin).toLocaleDateString('es-ES') : '-',
                r.porcentaje >= 60 ? 'APROBADO' : 'REPROBADO',
            ]),
            theme: 'plain',
            headStyles: { fillColor: PRIMARY_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5, cellPadding: 3.5 },
            bodyStyles: { fontSize: 8, cellPadding: 3.5 },
            alternateRowStyles: { fillColor: GRAY_LIGHT },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 26, halign: 'center' },
                2: { halign: 'center', fontStyle: 'bold' },
                3: { halign: 'center' },
                4: { halign: 'center' },
                5: { halign: 'center' },
                6: { halign: 'center', fontStyle: 'bold' },
            },
            didParseCell(data) {
                if (data.section === 'body') {
                    if (data.column.index === 2) data.cell.styles.textColor = parseFloat(data.cell.raw) >= 60 ? GREEN : RED;
                    if (data.column.index === 6) data.cell.styles.textColor = data.cell.raw === 'APROBADO' ? GREEN : RED;
                }
            },
            margin: { left: 14, right: 14 },
        });

        addFooter(doc);
        doc.save(`reporte_gaf_${new Date().toISOString().slice(0, 10)}.pdf`);
    },

    exportarDetalle(detalle) {
        const doc = new jsPDF({ orientation: 'portrait' });
        const W = doc.internal.pageSize.getWidth();

        addHeader(doc, 'Resultado de Prueba', detalle.usuario.nombreCompleto.toUpperCase());

        let y = 42;

        // Info del usuario
        doc.setFillColor(...GRAY_LIGHT);
        doc.roundedRect(14, y, W - 28, 26, 2, 2, 'F');
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(0.8);
        doc.line(14, y, 14, y + 26);

        const col1 = 20, col2 = W / 2 + 4;
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...GRAY_TEXT);
        doc.text('NOMBRE COMPLETO', col1, y + 7);
        doc.text('CEDULA', col1, y + 18);
        doc.text('FECHA DE PRESENTACION', col2, y + 7);
        doc.text('RESULTADO', col2, y + 18);

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...DARK);
        doc.text(detalle.usuario.nombreCompleto, col1, y + 13);
        doc.text(detalle.usuario.cedula, col1, y + 23);
        doc.text(new Date(detalle.intento.fechaFin).toLocaleDateString('es-ES'), col2, y + 13);

        const pct = Number(detalle.intento.porcentaje).toFixed(2);
        doc.setTextColor(...(pct >= 60 ? GREEN : RED));
        doc.setFontSize(12);
        doc.text(`${pct}%  ${pct >= 60 ? 'APROBADO' : 'REPROBADO'}`, col2, y + 23);

        y += 34;

        // Resumen
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...PRIMARY_DARK);
        doc.text('RESUMEN DE RESULTADOS', 14, y);
        y += 4;
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(0.4);
        doc.line(14, y, W - 14, y);
        y += 3;

        autoTable(doc, {
            startY: y,
            head: [['Correctas', 'Incorrectas', 'Total Preguntas', 'Tiempo Empleado', 'Calificacion']],
            body: [[
                detalle.intento.respuestasCorrectas,
                detalle.intento.totalPreguntas - detalle.intento.respuestasCorrectas,
                detalle.intento.totalPreguntas,
                `${Math.floor(detalle.intento.tiempoSegundos / 60)}m ${detalle.intento.tiempoSegundos % 60}s`,
                `${Number(detalle.intento.calificacion || 0).toFixed(2)} / 5.00`,
            ]],
            theme: 'plain',
            headStyles: { fillColor: PRIMARY_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 8, cellPadding: 4, halign: 'center' },
            bodyStyles: { halign: 'center', fontStyle: 'bold', fontSize: 10, cellPadding: 5 },
            didParseCell(data) {
                if (data.section === 'body') {
                    if (data.column.index === 0) data.cell.styles.textColor = GREEN;
                    if (data.column.index === 1) data.cell.styles.textColor = RED;
                }
            },
            margin: { left: 14, right: 14 },
        });

        y = doc.lastAutoTable.finalY + 10;

        // Detalle de respuestas
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...PRIMARY_DARK);
        doc.text('DETALLE DE RESPUESTAS', 14, y);
        y += 4;
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(0.4);
        doc.line(14, y, W - 14, y);
        y += 3;

        autoTable(doc, {
            startY: y,
            head: [['N', 'Pregunta', 'Respuesta', 'Correcta', 'Resultado']],
            body: detalle.respuestas.map((r, i) => [
                i + 1,
                r.texto_pregunta.length > 65 ? r.texto_pregunta.substring(0, 65) + '...' : r.texto_pregunta,
                r.respuesta_usuario || '-',
                r.respuesta_correcta,
                r.es_correcta ? 'CORRECTA' : 'INCORRECTA',
            ]),
            theme: 'plain',
            headStyles: { fillColor: PRIMARY_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5, cellPadding: 3.5 },
            bodyStyles: { fontSize: 7.5, cellPadding: 3 },
            alternateRowStyles: { fillColor: GRAY_LIGHT },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10, fontStyle: 'bold' },
                1: { cellWidth: 105 },
                2: { halign: 'center', cellWidth: 18 },
                3: { halign: 'center', cellWidth: 18 },
                4: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
            },
            didParseCell(data) {
                if (data.section === 'body' && data.column.index === 4) {
                    data.cell.styles.textColor = data.cell.raw === 'CORRECTA' ? GREEN : RED;
                }
            },
            margin: { left: 14, right: 14 },
        });

        addFooter(doc);
        const nombre = detalle.usuario.nombreCompleto.replace(/\s+/g, '_').toLowerCase();
        doc.save(`resultado_${nombre}.pdf`);
    }
};
