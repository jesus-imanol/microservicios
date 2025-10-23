# 🚀 INSTRUCCIONES RÁPIDAS DE DESPLIEGUE

## Creado por: Jesús Imanol Castillo Avendaño

### ✅ Paso 1: Verificar prerrequisitos
```cmd
docker --version
docker-compose --version
```

### ✅ Paso 2: Navegar al directorio del proyecto
```cmd
cd c:\Users\jesus\core\7C\SistemasOperativos\C2\microservicios
```

### ✅ Paso 3: Ejecutar el script de inicio (RECOMENDADO)
```cmd
start.bat
```

O manualmente:
```cmd
docker-compose up -d --build
```

### ✅ Paso 4: Verificar que todo esté corriendo
```cmd
verify.bat
```

O manualmente:
```cmd
docker-compose ps
```

### ✅ Paso 5: Acceder a la aplicación
- **Frontend**: http://localhost
- **Backend**: http://localhost:8000/post_couples
- **Base de Datos**: localhost:3306

### ✅ Paso 6: Ver logs en tiempo real
```cmd
docker-compose logs -f
```

### ✅ Para detener los servicios
```cmd
docker-compose down
```

### ✅ Para reiniciar desde cero (elimina datos)
```cmd
docker-compose down -v
docker-compose up -d --build
```

---

## 📋 CUMPLIMIENTO DE REQUISITOS

### ✅ Contenedor Frontend (jesus_frontend)
- [x] React con Vite
- [x] Consume API REST del backend
- [x] Puerto 80 expuesto
- [x] Dockerfile personalizado con multi-stage build
- [x] Nombre "Jesús Imanol Castillo Avendaño" visible en header

### ✅ Contenedor Backend (avendano_backend)
- [x] API REST en Go
- [x] CRUD completo conectado a MySQL
- [x] Puerto 8000 expuesto
- [x] Variables de entorno configuradas
- [x] Dockerfile personalizado
- [x] Base de datos "castillo_db" (apellido)

### ✅ Contenedor Base de Datos (castillo_mysql)
- [x] MySQL 8.0
- [x] Persistencia con volumen `castillo_mysql_data`
- [x] Credenciales seguras
- [x] Puerto 3306 expuesto
- [x] Volumen nombrado (no anónimo)

### ✅ docker-compose.yml
- [x] Tres servicios definidos
- [x] Red `castillo_network` configurada
- [x] Nombres con apellido/nombre (castillo, avendano, jesus)
- [x] Volumen explícito definido
- [x] depends_on con healthchecks
- [x] Dockerfiles personalizados

---

## 🎯 ENDPOINTS DISPONIBLES

### Backend API (http://localhost:8000)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /post_couples | Obtener todas las publicaciones |
| GET | /post_couples/tag/:tag | Buscar por etiqueta |
| POST | /post_couples | Crear nueva publicación |
| PUT | /post_couples/:id | Actualizar publicación |
| PATCH | /post_couples/:id/like | Dar me gusta |
| DELETE | /post_couples/:id | Eliminar publicación |

---

## 🔍 COMANDOS ÚTILES

### Ver logs de un servicio específico
```cmd
docker-compose logs -f jesus_frontend
docker-compose logs -f avendano_backend
docker-compose logs -f castillo_mysql
```

### Entrar a un contenedor
```cmd
docker exec -it jesus_frontend_container sh
docker exec -it avendano_backend_container sh
docker exec -it castillo_mysql_container bash
```

### Conectarse a MySQL
```cmd
docker exec -it castillo_mysql_container mysql -u jesus_user -pjesus_password_secure_2025 castillo_db
```

### Ver red y volúmenes
```cmd
docker network inspect castillo_network
docker volume inspect castillo_mysql_data
```

### Reconstruir solo un servicio
```cmd
docker-compose up -d --build jesus_frontend
docker-compose up -d --build avendano_backend
```

---

## 🐛 TROUBLESHOOTING

### Si el frontend no carga:
```cmd
docker-compose logs jesus_frontend
docker-compose restart jesus_frontend
```

### Si el backend no conecta a la DB:
```cmd
docker-compose logs avendano_backend
docker-compose logs castillo_mysql
```

### Si hay problemas de red:
```cmd
docker network rm castillo_network
docker-compose up -d --build
```

### Limpiar todo y empezar de nuevo:
```cmd
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## ✨ CARACTERÍSTICAS IMPLEMENTADAS

- ✅ Arquitectura de microservicios completa
- ✅ Frontend React con diseño moderno
- ✅ API REST en Go con todas las operaciones CRUD
- ✅ Base de datos MySQL con persistencia
- ✅ Docker Compose con healthchecks
- ✅ Red interna para comunicación entre servicios
- ✅ Volúmenes nombrados para persistencia
- ✅ Multi-stage builds para optimización
- ✅ Variables de entorno seguras
- ✅ Scripts de automatización
- ✅ Nombre del autor visible en la aplicación

---

**¡Proyecto listo para demostración!** 🎉
