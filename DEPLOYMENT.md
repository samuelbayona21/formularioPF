# Guía de Despliegue en Railway

## 📋 Requisitos Previos

1. Cuenta en [Railway.app](https://railway.app)
2. Repositorio Git del proyecto
3. Base de datos MySQL configurada en Railway

## 🚀 Pasos para Desplegar

### 1. Configurar Base de Datos MySQL en Railway

1. En Railway, crea un nuevo proyecto
2. Agrega un servicio de MySQL:
   - Click en "New" → "Database" → "Add MySQL"
3. Railway generará automáticamente estas variables:
   - `MYSQLHOST`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLPORT`

### 2. Importar Base de Datos

Conéctate a tu base de datos MySQL de Railway y ejecuta:

```bash
mysql -h [MYSQLHOST] -u [MYSQLUSER] -p[MYSQLPASSWORD] -P [MYSQLPORT] [MYSQLDATABASE] < backend/database/setup_completo.sql
```

O usa un cliente MySQL como MySQL Workbench con las credenciales de Railway.

### 3. Desplegar Backend

1. En Railway, agrega un nuevo servicio desde GitHub:
   - Click en "New" → "GitHub Repo"
   - Selecciona tu repositorio

2. Railway detectará automáticamente el proyecto Node.js usando Nixpacks

3. Configura las variables de entorno en Railway:
   ```
   NODE_ENV=production
   SESSION_SECRET=tu_secreto_super_seguro_generado_aleatoriamente
   FRONTEND_URL=https://tu-frontend.railway.app
   CORS_ORIGIN=https://tu-frontend.railway.app
   ```

4. Railway detectará automáticamente las variables de MySQL

5. El backend se desplegará automáticamente

**Nota:** Si Railway intenta usar Docker y falla, ve a Settings → Deploy y cambia el Builder a "Nixpacks".

### 4. Desplegar Frontend React

1. En Railway, agrega otro servicio desde el mismo repositorio
2. Configura el directorio raíz: `frontend-react`
3. Configura las variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```

4. Agrega el build command:
   ```
   npm install && npm run build
   ```

5. Agrega el start command:
   ```
   npm run preview
   ```

### 5. Actualizar Frontend para Producción

Crea un archivo `frontend-react/.env.production`:

```env
VITE_API_URL=https://tu-backend.railway.app/api
```

Y actualiza `frontend-react/src/services/api.js`:

```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
```

## 🔧 Variables de Entorno Requeridas

### Backend (Railway)
```
# Automáticas de MySQL
MYSQLHOST=
MYSQLDATABASE=
MYSQLUSER=
MYSQLPASSWORD=
MYSQLPORT=

# Manuales
NODE_ENV=production
SESSION_SECRET=genera_un_secreto_aleatorio_seguro
FRONTEND_URL=https://tu-frontend.railway.app
CORS_ORIGIN=https://tu-frontend.railway.app
PORT=8000
```

### Frontend (Railway)
```
VITE_API_URL=https://tu-backend.railway.app/api
```

## 📝 Notas Importantes

1. **CORS**: Asegúrate de que `CORS_ORIGIN` en el backend coincida con la URL de tu frontend
2. **Cookies**: Las cookies funcionarán con `credentials: true` y `sameSite: 'none'` en producción
3. **HTTPS**: Railway proporciona HTTPS automáticamente
4. **Logs**: Revisa los logs en Railway si hay problemas
5. **Base de datos**: Haz backup regular de tu base de datos

## 🔄 Actualizar Despliegue

Railway se actualiza automáticamente cuando haces push a tu repositorio:

```bash
git add .
git commit -m "Actualización"
git push origin main
```

## 🐛 Solución de Problemas

### Error: "npm: command not found" durante el build
Railway está intentando usar Docker en lugar de Nixpacks. Solución:
1. Ve a Settings del servicio en Railway
2. En la sección "Deploy", cambia el Builder a "Nixpacks"
3. Redeploy el servicio

### Error de CORS
- Verifica que `CORS_ORIGIN` esté configurado correctamente
- Asegúrate de que `withCredentials: true` esté en el frontend

### Error de Base de Datos
- Verifica que las variables `MYSQL*` estén disponibles
- Revisa los logs de Railway para errores de conexión
- Asegúrate de que la base de datos esté en la misma región

### Error 502/503
- El backend puede estar iniciando, espera 1-2 minutos
- Revisa los logs para errores de inicio
- Verifica que el puerto esté configurado correctamente (Railway asigna automáticamente)

## 📚 Recursos

- [Documentación de Railway](https://docs.railway.app)
- [Railway MySQL](https://docs.railway.app/databases/mysql)
- [Variables de Entorno](https://docs.railway.app/develop/variables)

## 🎯 URLs de Ejemplo

Después del despliegue tendrás:
- Backend: `https://tu-proyecto-backend.railway.app`
- Frontend: `https://tu-proyecto-frontend.railway.app`
- API Health: `https://tu-proyecto-backend.railway.app/api/health`
