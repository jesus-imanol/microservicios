@echo off
REM Script de verificacion del proyecto
REM Creado por Jesús Imanol Castillo Avendaño

echo ========================================
echo   VERIFICACION DE MICROSERVICIOS
echo ========================================
echo.

echo [1] Verificando estado de contenedores...
docker-compose ps
echo.

echo [2] Verificando red castillo_network...
docker network inspect castillo_network
echo.

echo [3] Verificando volumen castillo_mysql_data...
docker volume inspect castillo_mysql_data
echo.

echo [4] Probando endpoint del backend...
curl -s http://localhost:8000/post_couples
echo.

echo [5] Verificando logs del backend...
docker-compose logs --tail=20 avendano_backend
echo.

echo [6] Verificando logs del frontend...
docker-compose logs --tail=20 jesus_frontend
echo.

echo [7] Verificando logs de MySQL...
docker-compose logs --tail=20 castillo_mysql
echo.

echo ========================================
echo   VERIFICACION COMPLETA
echo ========================================
pause
