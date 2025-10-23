@echo off
REM Script para levantar el proyecto de microservicios
REM Creado por Jesús Imanol Castillo Avendaño

echo ========================================
echo   MICROSERVICIOS - DOCKER COMPOSE
echo   Autor: Jesus Imanol Castillo Avendano
echo ========================================
echo.

echo [1] Deteniendo contenedores previos...
docker-compose down

echo.
echo [2] Construyendo imagenes...
docker-compose build --no-cache

echo.
echo [3] Levantando servicios...
docker-compose up -d

echo.
echo [4] Esperando a que los servicios esten listos...
timeout /t 30 /nobreak

echo.
echo [5] Verificando estado de los contenedores...
docker-compose ps

echo.
echo ========================================
echo   SERVICIOS DISPONIBLES:
echo ========================================
echo   Frontend:  http://localhost
echo   Backend:   http://localhost:8000/post_couples
echo   MySQL:     localhost:3306
echo ========================================
echo.
echo Para ver los logs: docker-compose logs -f
echo Para detener: docker-compose down
echo.
pause
