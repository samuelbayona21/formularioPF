@echo off
echo ========================================
echo   SISTEMA DE EXAMEN - INICIO RAPIDO
echo ========================================
echo.

echo [1/4] Verificando servicios XAMPP...
echo.
echo Por favor, asegurate de que XAMPP este corriendo:
echo   - Apache: DEBE estar en verde
echo   - MySQL: DEBE estar en verde
echo.
pause

echo.
echo [2/4] Abriendo phpMyAdmin para configurar BD...
start http://localhost/phpmyadmin
echo.
echo INSTRUCCIONES:
echo 1. En phpMyAdmin, ve a la pestana SQL
echo 2. Copia y pega el contenido de: database/schema.sql
echo 3. Haz clic en Continuar
echo 4. Luego copia y pega: database/actualizar_bd.sql
echo 5. Haz clic en Continuar
echo.
pause

echo.
echo [3/4] Abriendo sistema para cargar CSV...
start http://localhost/examen_contabilidad/views/admin/cargar_sistema_completo.html
echo.
echo INSTRUCCIONES:
echo 1. Selecciona tus 3 archivos CSV:
echo    - preguntas.csv
echo    - respuestas.csv
echo    - calificacion.csv
echo 2. Haz clic en "Cargar Sistema Completo"
echo.
pause

echo.
echo [4/4] Abriendo pagina principal...
start http://localhost/examen_contabilidad/
echo.
echo ========================================
echo   SISTEMA LISTO!
echo ========================================
echo.
echo URLs importantes:
echo - Login: http://localhost/examen_contabilidad/
echo - Admin: http://localhost/examen_contabilidad/views/admin/dashboard.html
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
