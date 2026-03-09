# Sistema de Examen de Contabilidad GAF

Sistema completo de exámenes en línea con arquitectura limpia (Clean Architecture), desarrollado con Node.js, Express, React y MySQL.

## 🏗️ Arquitectura

### Backend - Clean Architecture
```
backend/
├── src/
│   ├── domain/              # Capa de Dominio
│   │   ├── entities/        # Entidades de negocio
│   │   ├── use-cases/       # Casos de uso
│   │   └── repositories/    # Interfaces de repositorios
│   ├── application/         # Capa de Aplicación
│   │   ├── dtos/           # Data Transfer Objects
│   │   └── mappers/        # Mapeadores
│   ├── infrastructure/      # Capa de Infraestructura
│   │   ├── database/       # Configuración de BD
│   │   ├── repositories/   # Implementación de repositorios
│   │   └── config/         # Contenedor de dependencias
│   └── presentation/        # Capa de Presentación
│       ├── controllers/    # Controladores HTTP
│       ├── routes/         # Rutas de la API
│       └── middleware/     # Middleware
├── database/               # Scripts SQL
└── server.js              # Punto de entrada
```

### Frontend - React + Vite
```
frontend-react/
├── src/
│   ├── pages/             # Páginas principales
│   ├── components/        # Componentes reutilizables
│   ├── services/          # Servicios API
│   ├── hooks/             # Custom hooks
│   └── styles/            # Estilos globales
└── public/                # Archivos estáticos
```

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- MySQL 8.0+
- npm o yarn

### Instalación Local

1. **Clonar repositorio**
```bash
git clone <tu-repositorio>
cd formularioPF
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

3. **Configurar Base de Datos**
```bash
mysql -u root -p < backend/database/setup_completo.sql
```

4. **Iniciar Backend**
```bash
npm start
# Backend corriendo en http://localhost:8000
```

5. **Configurar Frontend**
```bash
cd frontend-react
npm install
```

6. **Iniciar Frontend**
```bash
npm run dev
# Frontend corriendo en http://localhost:3000
```

## 🌐 Despliegue en Railway

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de despliegue en Railway.

### Resumen Rápido

1. **Base de Datos**: Crear servicio MySQL en Railway
2. **Backend**: Desplegar desde GitHub, configurar variables de entorno
3. **Frontend**: Desplegar desde GitHub, configurar `VITE_API_URL`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/admin/login` - Login de administrador
- `POST /api/admin/logout` - Logout de administrador

### Examen
- `GET /api/examen/preguntas` - Obtener preguntas
- `POST /api/examen/respuesta` - Guardar respuesta
- `GET /api/examen/tiempo` - Obtener tiempo transcurrido
- `POST /api/examen/tiempo` - Guardar tiempo
- `POST /api/examen/finalizar` - Finalizar examen

### Administración
- `GET /api/admin/resultados` - Listar resultados (con filtros)
- `GET /api/admin/estadisticas` - Estadísticas generales
- `GET /api/admin/resultado/:intentoId` - Detalle de resultado

## 🔧 Scripts Útiles

### Backend
```bash
npm start              # Iniciar servidor
npm run dev            # Modo desarrollo con hot-reload
node scripts/truncate-data.js --keep-users    # Limpiar datos manteniendo usuarios
node scripts/truncate-data.js --keep-admins   # Limpiar todo excepto admins
```

### Frontend
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build para producción
npm run preview        # Preview del build
```

## 👥 Usuarios por Defecto

### Administradores
- Usuario: `admin` / Contraseña: `admin123`
- Usuario: `oscar2026` / Contraseña: `oscar2026`

### Estudiantes
Los estudiantes se registran automáticamente al iniciar un examen con su nombre y cédula.

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- MySQL2
- express-session
- CORS
- dotenv

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS 3
- Vite

## � Características

- ✅ Arquitectura limpia y escalable
- ✅ Autenticación con sesiones
- ✅ Panel administrativo completo
- ✅ Sistema de exámenes con temporizador
- ✅ Cálculo automático de resultados
- ✅ Filtrado y búsqueda de resultados
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Manejo de errores con modales
- ✅ Responsive design
- ✅ Scripts de mantenimiento de BD

## 📄 Licencia

MIT

## 👨‍💻 Autor

G.F. SISTEMAS
