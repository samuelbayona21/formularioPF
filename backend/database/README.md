# Scripts de Base de Datos

Esta carpeta contiene los scripts SQL para configurar y mantener la base de datos del sistema.

## Scripts Disponibles

### 1. setup_completo.sql
Script de configuración inicial que crea todas las tablas necesarias:
- `usuarios`
- `examenes`
- `preguntas`
- `opciones_respuesta`
- `intentos_examen`
- `respuestas_usuarios`
- `resultados`

**Uso:**
```bash
mysql -u root -p nombre_base_datos < backend/database/setup_completo.sql
```

### 2. migration_add_password.sql
Migración para agregar el campo de contraseña a usuarios administradores.

**Uso:**
```bash
mysql -u root -p nombre_base_datos < backend/database/migration_add_password.sql
```

### 3. truncate_except_users.sql
Limpia todos los datos de exámenes (intentos, respuestas, resultados) pero **mantiene TODOS los usuarios** (administradores y estudiantes).

**Uso manual:**
```bash
mysql -u root -p nombre_base_datos < backend/database/truncate_except_users.sql
```

**Uso con script Node.js:**
```bash
cd backend
node scripts/truncate-data.js --keep-users
```

### 4. reset_keep_admins.sql
Resetea completamente el sistema eliminando:
- Todos los intentos de examen
- Todas las respuestas
- Todos los resultados
- Todos los usuarios estudiantes

**Mantiene solo:** Usuarios administradores

⚠️ **ADVERTENCIA:** Este script elimina permanentemente todos los datos de estudiantes.

**Uso manual:**
```bash
mysql -u root -p nombre_base_datos < backend/database/reset_keep_admins.sql
```

**Uso con script Node.js:**
```bash
cd backend
node scripts/truncate-data.js --keep-admins
```

## Script Node.js: truncate-data.js

Script automatizado para ejecutar las operaciones de limpieza desde Node.js.

**Ubicación:** `backend/scripts/truncate-data.js`

**Opciones:**
- `--keep-users`: Limpia exámenes pero mantiene todos los usuarios
- `--keep-admins`: Limpia todo excepto administradores

**Ejemplos:**
```bash
# Limpiar solo datos de exámenes
cd backend
node scripts/truncate-data.js --keep-users

# Resetear sistema completo (solo mantener admins)
cd backend
node scripts/truncate-data.js --keep-admins
```

## Notas Importantes

1. **Siempre haz backup** antes de ejecutar scripts de limpieza
2. Los scripts desactivan temporalmente `FOREIGN_KEY_CHECKS` para evitar errores de integridad referencial
3. Después de ejecutar, los scripts muestran un resumen de los usuarios que se mantuvieron
4. Los administradores predeterminados son:
   - Usuario: `admin` / Contraseña: `admin123`
   - Usuario: `oscar2026` / Contraseña: `oscar2026`

## Backup Recomendado

Antes de ejecutar cualquier script de limpieza:

```bash
mysqldump -u root -p nombre_base_datos > backup_$(date +%Y%m%d_%H%M%S).sql
```
