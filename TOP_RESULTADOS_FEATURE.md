# Feature: Top 5 Mejores Resultados

## Descripción
Se agregó una sección en el Dashboard Administrativo que muestra el Top 5 de usuarios con mejor desempeño en los exámenes.

## Características

### Backend

**Nuevo Endpoint:**
- `GET /api/admin/top-resultados?limit=5`
- Requiere autenticación de administrador
- Parámetro opcional: `limit` (por defecto 5)

**Caso de Uso:**
- `ObtenerTopResultadosUseCase` - Obtiene y formatea el ranking de mejores resultados

**Repositorio:**
- Método `getTopResultados(limit)` en `MySQLUsuarioRepository`
- Ordena por porcentaje DESC y tiempo ASC (mejor porcentaje primero, menor tiempo como desempate)
- Solo incluye exámenes completados

**Datos Retornados:**
```javascript
{
  posicion: 1,
  nombreCompleto: "Juan Pérez",
  cedula: "12345678",
  porcentaje: "95.00",
  respuestasCorrectas: 48,
  totalPreguntas: 50,
  tiempoSegundos: 1200,
  tiempoFormateado: "20m 0s",
  fechaFin: "2024-03-09T10:30:00.000Z",
  intentoId: 123
}
```

### Frontend

**Ubicación:**
- AdminDashboard, entre las estadísticas y los filtros

**Diseño:**
- Cards con gradientes especiales para Top 3:
  - 🥇 1er lugar: Gradiente dorado
  - 🥈 2do lugar: Gradiente plateado
  - 🥉 3er lugar: Gradiente bronce
  - 4to y 5to: Estilo estándar

**Información Mostrada:**
- Posición con emoji de medalla (Top 3)
- Nombre completo y cédula
- Respuestas correctas / Total
- Tiempo empleado
- Fecha de finalización
- Porcentaje destacado

**Interactividad:**
- Efecto RGB hover en cada card
- Click en cualquier resultado para ver detalle completo
- Responsive para móviles y tablets

## Criterios de Ranking

1. **Porcentaje de aciertos** (principal)
2. **Tiempo empleado** (desempate) - menor tiempo es mejor
3. Solo se consideran exámenes completados

## Beneficios

- Gamificación: Motiva a los usuarios a mejorar su desempeño
- Visibilidad: Los administradores pueden identificar rápidamente a los mejores estudiantes
- Reconocimiento: Destaca el esfuerzo de los usuarios con mejor rendimiento
- Análisis: Permite comparar tiempos y porcentajes de los mejores

## Ejemplo Visual

```
┌─────────────────────────────────────────────────────────┐
│ ⭐ Top 5 Mejores Resultados                             │
│ Usuarios con mejor desempeño                            │
├─────────────────────────────────────────────────────────┤
│ 🥇 Juan Pérez (CI: 12345678)                    98.00% │
│    48/50 correctas  ⏱️ 18m 30s  09/03/2024             │
├─────────────────────────────────────────────────────────┤
│ 🥈 María García (CI: 87654321)                  96.00% │
│    48/50 correctas  ⏱️ 20m 15s  08/03/2024             │
├─────────────────────────────────────────────────────────┤
│ 🥉 Carlos López (CI: 11223344)                  94.00% │
│    47/50 correctas  ⏱️ 19m 45s  07/03/2024             │
└─────────────────────────────────────────────────────────┘
```

## Archivos Modificados

### Backend
- `backend/src/domain/use-cases/ObtenerTopResultadosUseCase.js` (nuevo)
- `backend/src/infrastructure/repositories/MySQLUsuarioRepository.js`
- `backend/src/presentation/controllers/AdminController.js`
- `backend/src/infrastructure/config/container.js`
- `backend/src/presentation/routes/api.routes.js`

### Frontend
- `frontend-react/src/services/adminService.js`
- `frontend-react/src/pages/AdminDashboard.jsx`

## Notas Técnicas

- La consulta SQL usa `ORDER BY r.porcentaje DESC, ie.tiempo_segundos ASC` para el ranking
- El límite por defecto es 5, pero puede ajustarse desde el query parameter
- Si hay menos de 5 resultados, muestra solo los disponibles
- Los efectos RGB se aplican con la clase `.rgb-hover` del proyecto
