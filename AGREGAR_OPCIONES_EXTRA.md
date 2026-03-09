# Agregar Opciones E, F, G a Todas las Preguntas

## 📋 Descripción

Este script agrega tres opciones adicionales a todas las preguntas del examen:

- **Opción E:** "Solo A y B"
- **Opción F:** "Solo C y D"
- **Opción G:** "Todas las anteriores"

## 🚀 Cómo Ejecutar

### Opción 1: Usando el Script Node.js (Recomendado)

```bash
cd backend
node scripts/add-extra-options.js
```

### Opción 2: Ejecutar SQL Directamente

```bash
mysql -u root -p examen_contabilidad < backend/database/add_extra_options.sql
```

## ✅ Verificación

Después de ejecutar el script, verás una tabla mostrando:
- Total de preguntas
- Total de opciones
- Opciones por pregunta (debería ser 7: A, B, C, D, E, F, G)

## 📊 Ejemplo de Salida

```
┌────────────────┬───────────────┬─────────────────┬──────────────────────┐
│ pregunta_id    │ numero_pregunta│ total_opciones │ opciones_disponibles │
├────────────────┼───────────────┼─────────────────┼──────────────────────┤
│ 1              │ 1             │ 7               │ A,B,C,D,E,F,G        │
│ 2              │ 2             │ 7               │ A,B,C,D,E,F,G        │
│ ...            │ ...           │ ...             │ ...                  │
└────────────────┴───────────────┴─────────────────┴──────────────────────┘

✅ Opciones agregadas exitosamente

Opciones agregadas:
  E: Solo A y B
  F: Solo C y D
  G: Todas las anteriores
```

## 🔄 Ejecutar Múltiples Veces

El script es seguro para ejecutar múltiples veces. Verifica que las opciones no existan antes de insertarlas, por lo que no creará duplicados.

## ⚠️ Importante

### Antes de Ejecutar en Producción:

1. **Hacer backup de la base de datos:**
   ```bash
   mysqldump -u root -p examen_contabilidad > backup_antes_opciones.sql
   ```

2. **Verificar que no hay exámenes en progreso:**
   - Los usuarios que estén realizando un examen verán las nuevas opciones
   - Considera ejecutar esto cuando no haya usuarios activos

3. **Actualizar respuestas correctas si es necesario:**
   - Si alguna de las nuevas opciones (E, F, G) debe ser la respuesta correcta
   - Actualiza manualmente en la tabla `preguntas`:
   ```sql
   UPDATE preguntas SET respuesta_correcta = 'E' WHERE id = X;
   ```

## 🎯 Casos de Uso

### Ejemplo 1: Opción E como respuesta correcta
Si la pregunta es: "¿Cuáles son activos corrientes?"
- A: Efectivo
- B: Cuentas por cobrar
- C: Inventario
- D: Propiedad, planta y equipo
- **E: Solo A y B** ← Respuesta correcta

### Ejemplo 2: Opción G como respuesta correcta
Si la pregunta es: "¿Cuáles son principios contables?"
- A: Devengado
- B: Consistencia
- C: Prudencia
- D: Materialidad
- E: Solo A y B
- F: Solo C y D
- **G: Todas las anteriores** ← Respuesta correcta

## 📝 Modificar Respuestas Correctas

Para cambiar la respuesta correcta de una pregunta:

```sql
-- Ver preguntas actuales
SELECT id, numero_pregunta, texto_pregunta, respuesta_correcta 
FROM preguntas 
ORDER BY numero_pregunta;

-- Actualizar respuesta correcta
UPDATE preguntas 
SET respuesta_correcta = 'E'  -- o 'F' o 'G'
WHERE id = 1;  -- ID de la pregunta
```

## 🔙 Revertir Cambios

Si necesitas eliminar las opciones E, F, G:

```sql
DELETE FROM opciones 
WHERE letra_opcion IN ('E', 'F', 'G');
```

## 📞 Soporte

Si tienes problemas:
1. Verifica que la base de datos esté corriendo
2. Revisa que tengas permisos de INSERT
3. Verifica los logs del script para errores específicos
