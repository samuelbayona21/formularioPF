# Fix: Error de Conexión a Base de Datos en Railway

## 🔴 Error

```
Error: connect ECONNREFUSED ::1:3306
```

## 🔍 Causa

El backend está intentando conectarse a `localhost:3306` en lugar de usar las credenciales de MySQL de Railway.

## ✅ Solución Aplicada

Actualicé `backend/src/infrastructure/database/mysql.js` para que lea las variables de entorno de Railway (`MYSQLHOST`, `MYSQLUSER`, etc.) además de las locales (`DB_HOST`, `DB_USER`, etc.).

## 🚀 Pasos para Desplegar la Corrección

### 1. Hacer Commit y Push

```bash
git add .
git commit -m "Fix: Configurar conexión MySQL para Railway"
git push origin main
```

### 2. Verificar Variables en Railway

Ve a tu servicio en Railway → **Settings** → **Variables** y asegúrate de tener:

```
✅ MYSQLHOST          (automática del servicio MySQL)
✅ MYSQLDATABASE      (automática del servicio MySQL)
✅ MYSQLUSER          (automática del servicio MySQL)
✅ MYSQLPASSWORD      (automática del servicio MySQL)
✅ MYSQLPORT          (automática del servicio MySQL)
✅ NODE_ENV=production
✅ SESSION_SECRET=tu_secreto_aleatorio
```

### 3. Verificar que MySQL está en el Mismo Proyecto

El servicio MySQL debe estar en el **mismo proyecto** de Railway que tu backend. Railway conecta automáticamente los servicios del mismo proyecto.

Si no tienes MySQL:
1. En Railway, click en **New** → **Database** → **Add MySQL**
2. Railway creará el servicio y agregará las variables automáticamente

### 4. Importar Base de Datos

Si acabas de crear el servicio MySQL, necesitas importar la estructura:

#### Opción A: Desde Railway CLI
```bash
railway login
railway link
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < backend/database/setup_completo.sql
```

#### Opción B: Desde MySQL Workbench
1. Obtén las credenciales de Railway (Settings → Variables)
2. Conéctate con MySQL Workbench
3. Ejecuta el archivo `backend/database/setup_completo.sql`

#### Opción C: Desde línea de comandos local
```bash
mysql -h [MYSQLHOST] -u [MYSQLUSER] -p[MYSQLPASSWORD] -P [MYSQLPORT] [MYSQLDATABASE] < backend/database/setup_completo.sql
```

### 5. Redeploy

Después del push, Railway redesplegará automáticamente. Si no:
1. Ve a **Deployments**
2. Click en los tres puntos del último deployment
3. Selecciona **Redeploy**

## 🔍 Verificar que Funciona

### 1. Ver Logs

En Railway → Tu servicio → **Logs**, deberías ver:

```
🚀 SERVIDOR INICIADO
Puerto: 8000
Entorno: production
```

Y NO deberías ver errores de `ECONNREFUSED`.

### 2. Probar el API

```bash
curl https://tu-proyecto.railway.app/api/health
```

Debería responder con:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 3. Probar Login

Abre tu aplicación y prueba hacer login. Ya no debería dar error 401.

## 🐛 Si Sigue Sin Funcionar

### Verificar Logs Detallados

En Railway → Logs, busca mensajes como:

```
Error: Access denied for user
Error: Unknown database
Error: Can't connect to MySQL server
```

### Verificar Conectividad

Ejecuta este comando en Railway (usando Railway CLI):

```bash
railway run node -e "console.log(process.env.MYSQLHOST)"
```

Debería mostrar el host de MySQL, no `undefined`.

### Verificar que el Servicio MySQL está Corriendo

En Railway:
1. Ve al servicio MySQL
2. Verifica que el estado sea **Active** (verde)
3. Si está detenido, inícialo

### Verificar Región

El backend y MySQL deben estar en la misma región:
1. Backend → Settings → General → Region
2. MySQL → Settings → General → Region
3. Deben coincidir (ej: us-west1)

## 📝 Configuración Local vs Producción

### Local (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=examen_contabilidad
DB_PORT=3306
```

### Railway (Variables de Entorno)
```
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLUSER=root
MYSQLPASSWORD=xxx
MYSQLDATABASE=railway
MYSQLPORT=3306
```

El código ahora lee ambas automáticamente.

## ✅ Checklist Final

- [ ] Código actualizado y pusheado a GitHub
- [ ] Variables de entorno configuradas en Railway
- [ ] Servicio MySQL creado y activo
- [ ] Base de datos importada
- [ ] Deployment exitoso sin errores en logs
- [ ] API responde correctamente
- [ ] Login funciona sin error 401

## 🎯 Resultado Esperado

Después de aplicar estos cambios:
- ✅ El backend se conecta correctamente a MySQL de Railway
- ✅ El login funciona sin errores
- ✅ Los datos se guardan correctamente
- ✅ No hay errores de conexión en los logs
