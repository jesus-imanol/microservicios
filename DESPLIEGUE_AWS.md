# 🚀 GUÍA DE DESPLIEGUE EN AWS EC2
**Creado por: Jesús Imanol Castillo Avendaño**

---

## 📋 PREREQUISITOS

- Instancia EC2 de AWS (Ubuntu 20.04 o superior)
- Key pair (.pem) para acceso SSH
- Security Group configurado

---

## 🔧 PASO 1: Configurar Security Group

En la consola de AWS EC2, configura tu Security Group:

```
Regla de entrada 1:
- Tipo: HTTP
- Puerto: 80
- Origen: 0.0.0.0/0

Regla de entrada 2:
- Tipo: Custom TCP
- Puerto: 8000
- Origen: 0.0.0.0/0

Regla de entrada 3 (OPCIONAL - solo para testing):
- Tipo: MySQL/Aurora
- Puerto: 3306
- Origen: Tu IP / 0.0.0.0/0

Regla de entrada 4:
- Tipo: SSH
- Puerto: 22
- Origen: Tu IP
```

---

## 📦 PASO 2: Transferir Archivos a AWS

### Opción A: Usando SCP (desde Windows)

```cmd
cd c:\Users\jesus\core\7C\SistemasOperativos\C2\

scp -i "C:\ruta\a\tu-llave.pem" -r microservicios ubuntu@TU-IP-PUBLICA-AWS:/home/ubuntu/
```

### Opción B: Usando Git (RECOMENDADO)

1. Sube tu proyecto a GitHub (sin el .env con contraseñas)
2. En AWS ejecuta:

```bash
cd /home/ubuntu
git clone https://github.com/tu-usuario/tu-repositorio.git microservicios
cd microservicios
```

### Opción C: Usando WinSCP (GUI)

1. Descarga WinSCP: https://winscp.net/
2. Conecta con:
   - Host: TU-IP-PUBLICA-AWS
   - Usuario: ubuntu
   - Key: tu-llave.pem
3. Arrastra la carpeta `microservicios` completa

---

## 🐳 PASO 3: Instalar Docker en AWS

Conéctate a tu instancia:

```bash
ssh -i "tu-llave.pem" ubuntu@TU-IP-PUBLICA-AWS
```

Ejecuta el script de instalación:

```bash
cd /home/ubuntu/microservicios

# Dar permisos de ejecución
chmod +x install-aws.sh

# Ejecutar instalación
./install-aws.sh
```

O manualmente:

```bash
# Actualizar sistema
sudo apt-get update -y
sudo apt-get upgrade -y

# Instalar Docker
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Agregar usuario al grupo docker
sudo usermod -aG docker ubuntu

# IMPORTANTE: Cerrar sesión y volver a conectar
exit
ssh -i "tu-llave.pem" ubuntu@TU-IP-PUBLICA-AWS

# Verificar
docker --version
docker-compose --version
```

---

## 🗄️ PASO 4: Verificar Configuración de Base de Datos

Tu `docker-compose.yml` ya tiene TODO configurado correctamente:

```yaml
castillo_mysql:
  image: mysql:8.0                    # ✅ MySQL
  ports:
    - "3306:3306"                     # ✅ Puerto expuesto
  volumes:
    - castillo_mysql_data:/var/lib/mysql  # ✅ Persistencia
    - ./init.sql:/docker-entrypoint-initdb.d/init.sql
  environment:
    MYSQL_DATABASE: castillo_db       # ✅ Nombre de BD
    MYSQL_USER: jesus_user            # ✅ Credenciales
    MYSQL_PASSWORD: jesus_password_secure_2025
```

El volumen `castillo_mysql_data` está definido explícitamente al final:

```yaml
volumes:
  castillo_mysql_data:
    name: castillo_mysql_data
    driver: local
```

---

## 🚀 PASO 5: Levantar los Servicios

```bash
cd /home/ubuntu/microservicios

# Construir y levantar
docker-compose up -d --build

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f castillo_mysql
docker-compose logs -f avendano_backend
docker-compose logs -f jesus_frontend
```

---

## ✅ PASO 6: Verificar que Todo Funciona

### 1. Verificar contenedores:
```bash
docker-compose ps
```

Deberías ver:
```
NAME                          STATUS        PORTS
castillo_mysql_container      Up (healthy)  0.0.0.0:3306->3306/tcp
avendano_backend_container    Up (healthy)  0.0.0.0:8000->3000/tcp
jesus_frontend_container      Up            0.0.0.0:80->3000/tcp
```

### 2. Verificar la base de datos:
```bash
docker exec -it castillo_mysql_container mysql -u jesus_user -pjesus_password_secure_2025 castillo_db -e "SHOW TABLES;"
```

Debería mostrar:
```
+-------------------------+
| Tables_in_castillo_db   |
+-------------------------+
| post_couple             |
+-------------------------+
```

### 3. Verificar datos iniciales:
```bash
docker exec -it castillo_mysql_container mysql -u jesus_user -pjesus_password_secure_2025 castillo_db -e "SELECT COUNT(*) FROM post_couple;"
```

### 4. Probar el backend:
```bash
curl http://localhost:8000/post_couples
```

### 5. Obtener tu IP pública:
```bash
curl ifconfig.me
```

---

## 🌐 PASO 7: Acceder desde el Navegador

Abre tu navegador y ve a:

```
Frontend: http://TU-IP-PUBLICA-AWS
Backend:  http://TU-IP-PUBLICA-AWS:8000/post_couples
```

---

## 🔍 VERIFICAR PERSISTENCIA DE DATOS

### 1. Ver el volumen:
```bash
docker volume inspect castillo_mysql_data
```

### 2. Probar persistencia:
```bash
# Crear un post de prueba
curl -X POST http://localhost:8000/post_couples \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Test de Persistencia",
    "contenido": "Verificando que los datos persisten",
    "nombre_anonimo": "Tester",
    "categoria": "Test",
    "etiquetas": ["test", "persistencia"]
  }'

# Detener contenedores
docker-compose down

# Levantar de nuevo
docker-compose up -d

# Verificar que el post sigue ahí
curl http://localhost:8000/post_couples
```

---

## 🐛 TROUBLESHOOTING

### Si MySQL no inicia:
```bash
docker-compose logs castillo_mysql
```

### Si el backend no conecta a MySQL:
```bash
# Ver logs del backend
docker-compose logs avendano_backend

# Verificar que MySQL esté healthy
docker-compose ps

# Probar conexión manualmente
docker exec -it avendano_backend_container sh
ping castillo_mysql
```

### Si el frontend no carga:
```bash
docker-compose logs jesus_frontend
docker-compose restart jesus_frontend
```

### Reiniciar todo desde cero:
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 📊 COMANDOS ÚTILES

### Ver logs en tiempo real:
```bash
docker-compose logs -f
```

### Entrar a un contenedor:
```bash
docker exec -it castillo_mysql_container bash
docker exec -it avendano_backend_container sh
docker exec -it jesus_frontend_container sh
```

### Ver uso de recursos:
```bash
docker stats
```

### Backup de la base de datos:
```bash
docker exec castillo_mysql_container mysqldump -u jesus_user -pjesus_password_secure_2025 castillo_db > backup.sql
```

### Restaurar backup:
```bash
docker exec -i castillo_mysql_container mysql -u jesus_user -pjesus_password_secure_2025 castillo_db < backup.sql
```

---

## 🎯 CHECKLIST FINAL

- [ ] Security Group configurado (puertos 80, 8000, 3306, 22)
- [ ] Docker y Docker Compose instalados
- [ ] Archivos transferidos a AWS
- [ ] `docker-compose up -d --build` ejecutado exitosamente
- [ ] Los 3 contenedores están corriendo
- [ ] MySQL está "healthy"
- [ ] Backend está "healthy"
- [ ] Puedes acceder al frontend desde el navegador
- [ ] La API responde en puerto 8000
- [ ] Los datos persisten después de `docker-compose down` y `up`

---

## ✅ CUMPLIMIENTO DE REQUISITOS DE BD

| Requisito | Cumplido | Evidencia |
|-----------|----------|-----------|
| MySQL (o PostgreSQL) | ✅ | MySQL 8.0 en `docker-compose.yml` |
| Persistencia con volúmenes | ✅ | `castillo_mysql_data:/var/lib/mysql` |
| Credenciales seguras | ✅ | Usuario: `jesus_user`, Password segura |
| Nombre de base de datos | ✅ | `castillo_db` |
| Puerto expuesto | ✅ | `3306:3306` |
| Volumen nombrado (NO anónimo) | ✅ | `castillo_mysql_data` definido explícitamente |
| Script de inicialización | ✅ | `init.sql` con datos de ejemplo |

---

**¡Proyecto listo para AWS!** 🎉
**Autor: Jesús Imanol Castillo Avendaño**
