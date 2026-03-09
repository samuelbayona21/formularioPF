# Solución de Problemas - Railway

## Problema: Railway muestra JSON en lugar de ejecutar la aplicación

Si ves el contenido de archivos JSON en el navegador en lugar de la aplicación funcionando, sigue estos pasos:

### Paso 1: Verificar el Builder
1. Ve a tu servicio en Railway
2. Click en **Settings** → **Deploy**
3. En **Builder**, asegúrate que esté seleccionado **NIXPACKS** (no Dockerfile)
4. Guarda los cambios

### Paso 2: Verificar el Start Command
1. En **Settings** → **Deploy**
2. En **Start Command**, debe decir: `npm start`
3. Si está vacío o dice otra cosa, cámbialo a `npm start`
4. Guarda los cambios

### Paso 3: Verificar Root Directory
1. En **Settings** → **General**
2. En **Root Directory**, debe estar **vacío** o decir `/`
3. NO debe decir `frontend-react` ni ningún otro directorio
4. Guarda los cambios

### Paso 4: Verificar Variables de Entorno
Asegúrate de tener estas variables configuradas en **Settings** → **Variables**:

```
NODE_ENV=production
PORT=8000
SESSION_SECRET=tu_secreto_aleatorio_seguro
CORS_ORIGIN=https://tu-frontend.railway.app
FRONTEND_URL=https://tu-frontend.railway.app
```

Y las variables de MySQL (automáticas si agregaste el servicio MySQL):
```
MYSQLHOST
MYSQLDATABASE
MYSQLUSER
MYSQLPASSWORD
MYSQLPORT
```

### Paso 5: Verificar Logs
1. Ve a la pestaña **Deployments**
2. Click en el último deployment
3. Revisa los logs para ver si hay errores
4. Busca mensajes como:
   - "🚀 SERVIDOR INICIADO"
   - "Puerto: 8000"
   - Errores de conexión a base de datos

### Paso 6: Forzar Redeploy
1. Ve a **Deployments**
2. Click en los tres puntos del último deployment
3. Selecciona **Redeploy**

### Paso 7: Verificar que el Servicio es para Backend
Si creaste el servicio para el frontend por error:
1. Crea un NUEVO servicio en Railway
2. Selecciona el mismo repositorio
3. En **Settings** → **General**, ponle un nombre como "backend" o "api"
4. Configura las variables de entorno
5. Asegúrate que Root Directory esté vacío

## Problema: Error de conexión a base de datos

### Verificar que MySQL está en el mismo proyecto
1. El servicio MySQL debe estar en el MISMO proyecto de Railway
2. Railway conecta automáticamente los servicios del mismo proyecto
3. Las variables `MYSQL*` deben aparecer automáticamente en tu servicio backend

### Verificar la configuración de la base de datos
En `backend/src/infrastructure/database/mysql.js`, debe usar las variables de entorno:
```javascript
host: process.env.MYSQLHOST || process.env.DB_HOST
database: process.env.MYSQLDATABASE || process.env.DB_NAME
user: process.env.MYSQLUSER || process.env.DB_USER
password: process.env.MYSQLPASSWORD || process.env.DB_PASS
port: process.env.MYSQLPORT || process.env.DB_PORT
```

## Problema: CORS Error

Si el frontend no puede conectarse al backend:

1. Verifica que `CORS_ORIGIN` en el backend tenga la URL correcta del frontend
2. Verifica que `VITE_API_URL` en el frontend tenga la URL correcta del backend
3. Ambos servicios deben usar HTTPS (Railway lo proporciona automáticamente)

## Comandos Útiles para Verificar

### Ver logs en tiempo real
En Railway, ve a tu servicio y click en la pestaña **Logs**

### Verificar que el servidor está corriendo
Accede a: `https://tu-backend.railway.app/api/health`

Deberías ver una respuesta JSON con información del API.

## Estructura Correcta del Proyecto

```
/
├── package.json          ← Railway lee este archivo
├── nixpacks.toml         ← Configuración de Nixpacks
├── railway.toml          ← Configuración de Railway
└── backend/
    ├── package.json      ← Dependencias del backend
    ├── server.js         ← Punto de entrada
    └── src/
```

## Contacto

Si sigues teniendo problemas:
1. Revisa los logs completos en Railway
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que la base de datos esté importada correctamente
