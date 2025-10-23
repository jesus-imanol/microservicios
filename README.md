# Proyecto de Microservicios con Do### 2. avendano_backend (API REST)
- **Tecnología**: Go 1.23.4 con Gin Framework
- **Puerto**: 8000 (interno: 3000)
- **Endpoints principales**:
  - `GET /post_couples` - Obtener todos los posts
  - `GET /post_couples/tag/:tag` - Buscar por etiqueta
  - `POST /post_couples` - Crear post
  - `PUT /post_couples/:id` - Actualizar post
  - `PATCH /post_couples/:id/like` - Incrementar me gusta
  - `DELETE /post_couples/:id` - Eliminar post
  - **`GET /avendano`** - Endpoint personal que retorna el nombre completo del creador
- **Dependencias**: Depende de `castillo_mysql`e
**Creado por: Jesús Imanol Castillo Avendaño**

## 📋 Descripción del Proyecto

Sistema de microservicios que implementa una aplicación web completa con:
- **Frontend**: React + Vite (CouplesApp)
- **Backend**: API REST en Go (Gin Framework)
- **Base de Datos**: MySQL 8.0 con persistencia

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  jesus_frontend │────────▶│ avendano_backend│────────▶│ castillo_mysql  │
│   (React:80)    │         │   (Go:8000)     │         │  (MySQL:3306)   │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │                           │
        └───────────────────────────┴───────────────────────────┘
                         castillo_network
```

## 🐳 Servicios Docker

### 1. castillo_mysql (Base de Datos)
- **Imagen**: mysql:8.0
- **Puerto**: 3306
- **Base de datos**: `castillo_db`
- **Usuario**: `jesus_user`
- **Contraseña**: `jesus_password_secure_2025`
- **Volumen**: `castillo_mysql_data` (persistencia de datos)
- **Inicialización**: Script SQL con datos de ejemplo

### 2. avendano_backend (API REST)
- **Tecnología**: Go 1.23.4 con Gin Framework
- **Puerto**: 8000 (interno: 3000)
- **Endpoints principales**:
  - `GET /post_couples` - Obtener todos los posts
  - `GET /post_couples/tag/:tag` - Buscar por etiqueta
  - `POST /post_couples` - Crear post
  - `PUT /post_couples/:id` - Actualizar post
  - `PATCH /post_couples/:id/like` - Incrementar me gusta
  - `DELETE /post_couples/:id` - Eliminar post
- **Dependencias**: Depende de `castillo_mysql`

### 3. jesus_frontend (Interfaz Web)
- **Tecnología**: React 19 + Vite + TailwindCSS
- **Puerto**: 80 (interno: 3000)
- **Características**:
  - Interfaz estilo Instagram/Twitter
  - CRUD completo de publicaciones
  - Búsqueda por etiquetas
  - Sistema de "me gusta"
  - Diseño responsivo
- **Dependencias**: Depende de `avendano_backend`

## 📦 Red y Volúmenes

### Red
- **Nombre**: `castillo_network`
- **Tipo**: Bridge
- **Propósito**: Comunicación interna entre contenedores

### Volúmenes
- **castillo_mysql_data**: Persistencia de datos de MySQL

## 🚀 Instrucciones de Uso

### Prerrequisitos
- Docker Desktop instalado
- Docker Compose instalado
- Puertos 80, 8000 y 3306 disponibles

### 1. Levantar los servicios
```bash
cd c:\Users\jesus\core\7C\SistemasOperativos\C2\microservicios
docker-compose up -d --build
```

### 2. Verificar que los contenedores están corriendo
```bash
docker-compose ps
```

Deberías ver:
```
NAME                          STATUS              PORTS
castillo_mysql_container      Up (healthy)        0.0.0.0:3306->3306/tcp
avendano_backend_container    Up (healthy)        0.0.0.0:8000->3000/tcp
jesus_frontend_container      Up                  0.0.0.0:80->3000/tcp
```

### 3. Acceder a la aplicación
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000/post_couples
- **Base de Datos**: localhost:3306

### 4. Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f jesus_frontend
docker-compose logs -f avendano_backend
docker-compose logs -f castillo_mysql
```

### 5. Detener los servicios
```bash
docker-compose down
```

### 6. Detener y eliminar volúmenes (CUIDADO: borra los datos)
```bash
docker-compose down -v
```

## 🔍 Verificación de Requisitos

### ✅ Requisitos Cumplidos

#### Contenedor Frontend
- ✅ Servicio web en React
- ✅ Consume API REST desde el backend
- ✅ Expone puerto 80 (mapeado desde 3000 interno)
- ✅ Dockerfile personalizado con build en dos etapas
- ✅ Nombre del creador visible en el header

#### Contenedor Backend
- ✅ API REST en Go con Gin Framework
- ✅ Conecta a MySQL para operaciones CRUD
- ✅ Expone puerto 8000 (interno 3000)
- ✅ Variables de entorno configuradas
- ✅ Dockerfile personalizado
- ✅ Base de datos con nombre `castillo_db` (apellido)
- ✅ Endpoint con operaciones completas

#### Contenedor Base de Datos
- ✅ MySQL 8.0
- ✅ Persistencia con volumen nombrado `castillo_mysql_data`
- ✅ Credenciales seguras configuradas
- ✅ Expone puerto 3306
- ✅ Volumen explícitamente definido (no anónimo)

#### docker-compose.yml
- ✅ Tres servicios definidos con configuraciones completas
- ✅ Red interna `castillo_network` configurada
- ✅ Nombres de contenedores incluyen nombre/apellido:
  - `castillo_mysql_container`
  - `avendano_backend_container`
  - `jesus_frontend_container`
- ✅ Volumen `castillo_mysql_data` definido explícitamente
- ✅ `depends_on` con healthchecks para orden de arranque
- ✅ Cada servicio tiene su Dockerfile
- ✅ Imágenes justificadas técnicamente

## 🧪 Pruebas

### Verificar comunicación entre servicios
```bash
# Entrar al contenedor frontend
docker exec -it jesus_frontend_container sh

# Hacer ping al backend (por nombre)
wget -O- http://avendano_backend:3000/post_couples

# Entrar al contenedor backend
docker exec -it avendano_backend_container sh

# Verificar conexión a MySQL
wget --spider http://castillo_mysql:3306
```

### Probar endpoints del backend
```bash
# Obtener todos los posts
curl http://localhost:8000/post_couples

# Buscar por tag
curl http://localhost:8000/post_couples/tag/playa

# Crear un post (ejemplo)
curl -X POST http://localhost:8000/post_couples \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Test desde Docker",
    "contenido": "Probando la API",
    "nombre_anonimo": "Docker User",
    "categoria": "Test",
    "etiquetas": ["docker", "test"]
  }'
```

## 📊 Base de Datos

### Conectarse a MySQL
```bash
docker exec -it castillo_mysql_container mysql -u jesus_user -pjesus_password_secure_2025 castillo_db
```

### Estructura de la tabla
```sql
USE castillo_db;
DESCRIBE post_couple;
SELECT * FROM post_couple;
```

## 🛠️ Troubleshooting

### Los contenedores no se comunican
```bash
docker network inspect castillo_network
```

### Reiniciar todo desde cero
```bash
docker-compose down -v
docker-compose up -d --build
```

### Ver el estado de salud de los servicios
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## 📝 Notas Técnicas

- **Multi-stage builds**: Ambos Dockerfiles usan builds en etapas para optimizar tamaño
- **Healthchecks**: Implementados para garantizar orden correcto de inicio
- **Persistencia**: Volumen nombrado garantiza que los datos sobreviven a reinicios
- **Red bridge**: Comunicación por nombre de servicio en red interna
- **Variables de entorno**: Configuración centralizada y segura

## 👨‍💻 Autor

**Jesús Imanol Castillo Avendaño**

Proyecto de Sistemas Operativos - Arquitectura de Microservicios con Docker
