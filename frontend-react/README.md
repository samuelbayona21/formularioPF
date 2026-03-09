# Frontend React - Sistema de Exámenes

Frontend construido con **React 18 + Vite** siguiendo mejores prácticas.

## 🏗️ Arquitectura

```
frontend-react/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── QuestionDisplay.jsx
│   │   ├── QuestionGrid.jsx
│   │   └── FinishModal.jsx
│   ├── pages/           # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Examen.jsx
│   │   └── Resultado.jsx
│   ├── services/        # Servicios API
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── examenService.js
│   ├── hooks/           # Custom Hooks
│   │   ├── useExamen.js
│   │   └── useTimer.js
│   ├── styles/          # Estilos CSS
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── public/              # Assets estáticos
├── index.html
├── vite.config.js       # Configuración de Vite
└── package.json
```

## 🚀 Instalación

```bash
npm install
```

## ▶️ Ejecutar

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

El servidor estará disponible en: `http://localhost:3000`

## 🎯 Características

### React Hooks Personalizados

**useExamen**
- Maneja el estado del examen
- Carga preguntas
- Guarda respuestas
- Navegación entre preguntas
- Cálculo de progreso

**useTimer**
- Temporizador con cuenta regresiva
- Persistencia de tiempo
- Callback cuando se agota el tiempo
- Formato de visualización

### Servicios

**authService**
- Login/Logout
- Verificación de autenticación
- Manejo de sesión

**examenService**
- Obtener preguntas
- Guardar respuestas
- Guardar tiempo
- Finalizar examen

**api**
- Cliente Axios configurado
- Interceptores para errores
- Manejo de sesiones

### Componentes

**Login**
- Validación de formulario
- Manejo de errores
- Loading states

**Examen**
- Temporizador con persistencia
- Grid de preguntas
- Navegación
- Guardado automático
- Modal de confirmación

**Resultado**
- Visualización de calificación
- Gráfico circular animado
- Detalles de respuestas

## 🔌 Integración con Backend

El frontend se comunica con el backend a través de:

```javascript
// Proxy configurado en vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true
  }
}
```

Todas las peticiones a `/api/*` se redirigen automáticamente al backend.

## 📦 Dependencias

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.20.0 (Routing)
- **axios**: ^1.6.2 (HTTP Client)
- **vite**: ^5.0.8 (Build Tool)

## 🎨 Estilos

Los estilos están organizados por página/componente:
- `Login.css` - Estilos del login
- `Examen.css` - Estilos del examen
- `Resultado.css` - Estilos de resultados
- `index.css` - Estilos globales

## 🔐 Autenticación

El sistema usa:
1. **Sesiones HTTP** (backend)
2. **LocalStorage** (frontend) para persistencia

Flujo:
1. Usuario hace login
2. Backend crea sesión HTTP
3. Frontend guarda datos en localStorage
4. Cada petición incluye cookies de sesión
5. Middleware valida sesión en backend

## 🧪 Testing (Futuro)

```bash
npm run test
```

## 📝 Variables de Entorno

Crear `.env` si necesitas configurar:

```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Deploy

```bash
# Build
npm run build

# Los archivos estarán en /dist
# Subir a Vercel, Netlify, etc.
```

## ✅ Ventajas de esta Arquitectura

1. **Componentes Reutilizables** - Fácil de mantener
2. **Custom Hooks** - Lógica separada de UI
3. **Servicios Centralizados** - Un solo lugar para API calls
4. **React Router** - Navegación SPA
5. **Vite** - Build ultra rápido
6. **TypeScript Ready** - Fácil migrar a TS

## 📖 Recursos

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
