#!/bin/bash
# Script de instalación para AWS EC2
# Creado por Jesús Imanol Castillo Avendaño

echo "=========================================="
echo "  INSTALACIÓN EN AWS EC2"
echo "  Autor: Jesús Imanol Castillo Avendaño"
echo "=========================================="
echo ""

# Verificar si se está ejecutando como root
if [ "$EUID" -eq 0 ]; then 
   echo "Error: No ejecutar este script como root (sudo)"
   exit 1
fi

# Actualizar sistema
echo "[1/7] Actualizando sistema..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Instalar Docker
echo "[2/7] Instalando Docker..."
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Instalar Docker Compose
echo "[3/7] Instalando Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Agregar usuario al grupo docker
echo "[4/7] Configurando permisos..."
sudo usermod -aG docker $USER

# Verificar instalación
echo "[5/7] Verificando instalación..."
docker --version
docker-compose --version

echo ""
echo "[6/7] IMPORTANTE: Necesitas cerrar sesión y volver a conectar para aplicar los permisos de Docker"
echo "Después, ejecuta: cd /home/ubuntu/microservicios && docker-compose up -d --build"
echo ""
read -p "¿Quieres levantar los servicios ahora? (requiere volver a ejecutar con 'newgrp docker') (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "[7/7] Iniciando servicios con permisos temporales..."
    cd /home/ubuntu/microservicios
    sudo docker-compose up -d --build
    
    echo ""
    echo "=========================================="
    echo "  INSTALACIÓN COMPLETADA"
    echo "=========================================="
    
    # Obtener IP pública
    PUBLIC_IP=$(curl -s ifconfig.me)
    
    echo "  Frontend:  http://$PUBLIC_IP"
    echo "  Backend:   http://$PUBLIC_IP:8000"
    echo "=========================================="
    echo ""
    echo "IMPORTANTE: Configura tu Security Group en AWS para permitir:"
    echo "  - Puerto 80 (HTTP)"
    echo "  - Puerto 8000 (API)"
    echo "  - Puerto 3306 (MySQL - opcional)"
    echo ""
    echo "Para ver logs: docker-compose logs -f"
    echo "Para detener: docker-compose down"
    echo ""
    echo "Verificando estado de los servicios..."
    sudo docker-compose ps
else
    echo ""
    echo "Instalación completada. Para iniciar los servicios:"
    echo "1. Cierra esta sesión: exit"
    echo "2. Vuelve a conectar por SSH"
    echo "3. Ejecuta: cd /home/ubuntu/microservicios && docker-compose up -d --build"
fi

echo ""
