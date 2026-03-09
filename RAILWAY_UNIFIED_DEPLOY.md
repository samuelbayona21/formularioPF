# Despliegue Unificado en Railway

## 📦 Configuración Actual

Tu proyecto está configurado para desplegar **backend y frontend juntos** en un solo servicio de Railway.

### Cómo Funciona:

1. **Build**: Railway construye el frontend React (`npm run build`)
2. **Deploy**: El backend Node.js sirve:
   - API en `/api/*`
   - Frontend estático en todas las demás rutas

### Ventajas:
- ✅ Un solo servicio (más económico)
- ✅ Sin problemas de CORS
- ✅ Misma URL para todo
- ✅ Cookies funcionan sin configuración especial

## 🚀 Desplegar Cambios

```bash
git add .
git commit -m "Configurar despliegue unificado"
git push origin main
```

Railway automáticamente:
1. Instalará dependencias del backend
2. Construirá el frontend React
3. Iniciará el servidor que sirve ambos

## 🔧 Variables de Entorno Necesarias

En Railway, configura estas variables:

```
NODE_ENV=production
SESSION_SECRET=genera_un_secreto_aleatorio_muy_seguro
PORT=8000
```

Variables de MySQL (automáticas si agregaste el servicio):
```
MYSQLHOST
MYSQLDATABASE  
MYSQLUSER
MYSQLPASSWORD
MYSQLPORT
```

**NO necesitas** configurar:
- `CORS_ORIGIN` (mismo dominio)
- `FRONTEND_URL` (mismo dominio)
- `VITE_API_URL` (ya está en .env.production como `/api`)

## 📍 URLs

Con tu URL de Railway: `https://pruebaconocimiento-gf.up.railway.app`

- **Frontend**: `https://pruebaconocimiento-gf.up.railway.app/`
- **API**: `https://pruebaconocimiento-gf.up.railway.app/api/`
- **Health**: `https://pruebaconocimiento-gf.up.railway.app/api/health`
- **Login**: `https://pruebaconocimiento-gf.up.railway.app/` (página de login)

## 🔍 Verificar Despliegue

### 1. Ver Logs
En Railway → Tu servicio → Logs

Busca:
```
🚀 SERVIDOR INICIADO
Puerto: 8000
Entorno: production
```

### 2. Probar API
```bash
curl https://pruebaconocimiento-gf.up.railway.app/api/health
```

### 3. Probar Frontend
Abre en el navegador:
```
https://pruebaconocimiento-gf.up.railway.app
```

Deberías ver la página de login.

## 🐛 Solución de Problemas

### Si ves JSON en lugar del frontend:
El build del frontend puede haber fallado. Revisa los logs de Railway.

### Si el frontend no carga:
1. Verifica que `frontend-react/dist` se haya creado
2. Revisa los logs para errores de build
3. Asegúrate que `npm run build` se ejecutó correctamente

### Si hay error 404 en las rutas:
El servidor está configurado para servir `index.html` en todas las rutas no-API, así que esto no debería pasar.

### Si el login no funciona:
1. Verifica que la base de datos esté conectada
2. Revisa que las variables `MYSQL*` estén configuradas
3. Verifica que la base de datos tenga los datos importados

## 📝 Estructura de Archivos

```
/
├── package.json              # Build del frontend + start del backend
├── railway.toml              # Configuración de Railway
├── backend/
│   ├── server.js            # Sirve API + frontend estático
│   └── ...
└── frontend-react/
    ├── dist/                # Generado por build (servido por backend)
    └── .env.production      # VITE_API_URL=/api
```

## 🎯 Flujo de Requests

```
Usuario → https://pruebaconocimiento-gf.up.railway.app/
         ↓
    Express Server
         ↓
    ¿Empieza con /api?
         ↓
    SÍ → API Routes (backend)
    NO → Archivos estáticos (frontend/dist)
```

## ✅ Checklist de Despliegue

- [ ] Variables de entorno configuradas en Railway
- [ ] Servicio MySQL creado y conectado
- [ ] Base de datos importada (`setup_completo.sql`)
- [ ] Código pusheado a GitHub
- [ ] Railway desplegó exitosamente
- [ ] Logs muestran "SERVIDOR INICIADO"
- [ ] `/api/health` responde correctamente
- [ ] Frontend carga en la raíz
- [ ] Login funciona correctamente
