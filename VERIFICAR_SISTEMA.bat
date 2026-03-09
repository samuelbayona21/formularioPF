@echo off
color 0A
echo ========================================
echo   VERIFICACION DEL SISTEMA
echo ========================================
echo.

echo [*] Verificando estructura de archivos...
if exist "index.html" (
    echo [OK] index.html encontrado
) else (
    echo [ERROR] index.html NO encontrado
)

if exist "config\database.php" (
    echo [OK] config\database.php encontrado
) else (
    echo [ERROR] config\database.php NO encontrado
)

if exist "database\schema.sql" (
    echo [OK] database\schema.sql encontrado
) else (
    echo [ERROR] database\schema.sql NO encontrado
)

if exist "css\theme.css" (
    echo [OK] css\theme.css encontrado
) else (
    echo [ERROR] css\theme.css NO encontrado
)

echo.
echo [*] Verificando carpetas...
if exist "images\" (
    echo [OK] Carpeta images\ existe
) else (
    echo [ERROR] Carpeta images\ NO existe
)

if exist "csv\" (
    echo [OK] Carpeta csv\ existe
) else (
    echo [ERROR] Carpeta csv\ NO existe
)

echo.
echo [*] Verificando archivos CSV de ejemplo...
if exist "csv\ejemplo_preguntas.csv" (
    echo [OK] ejemplo_preguntas.csv encontrado
) else (
    echo [AVISO] ejemplo_preguntas.csv NO encontrado
)

if exist "csv\ejemplo_respuestas.csv" (
    echo [OK] ejemplo_respuestas.csv encontrado
) else (
    echo [AVISO] ejemplo_respuestas.csv NO encontrado
)

if exist "csv\ejemplo_calificacion.csv" (
    echo [OK] ejemplo_calificacion.csv encontrado
) else (
    echo [AVISO] ejemplo_calificacion.csv NO encontrado
)

echo.
echo ========================================
echo   VERIFICACION COMPLETADA
echo ========================================
echo.
echo Presiona cualquier tecla para abrir URLs de prueba...
pause > nul

echo.
echo Abriendo URLs...
start http://localhost/examen_contabilidad/
timeout /t 2 > nul
start http://localhost/phpmyadmin
timeout /t 2 > nul
start http://localhost/examen_contabilidad/views/admin/dashboard.html

echo.
echo URLs abiertas. Presiona cualquier tecla para cerrar...
pause > nul
