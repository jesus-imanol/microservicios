# 🏗️ ARQUITECTURA DEL SISTEMA

## Creado por: Jesús Imanol Castillo Avendaño

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DOCKER HOST                                  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              CASTILLO_NETWORK (Bridge Network)                 │ │
│  │                                                                 │ │
│  │  ┌──────────────────┐      ┌──────────────────┐              │ │
│  │  │ jesus_frontend   │      │ avendano_backend │              │ │
│  │  │  (React + Vite)  │─────▶│   (Go + Gin)     │──┐           │ │
│  │  │                  │      │                  │  │           │ │
│  │  │  Port: 80:3000   │      │  Port: 8000:3000 │  │           │ │
│  │  │                  │      │                  │  │           │ │
│  │  │  - UI/UX         │      │  - CRUD API      │  │           │ │
│  │  │  - TanStack      │      │  - CORS enabled  │  │           │ │
│  │  │  - Axios HTTP    │      │  - Healthcheck   │  │           │ │
│  │  └──────────────────┘      └──────────────────┘  │           │ │
│  │                                                    │           │ │
│  │                             ┌──────────────────┐  │           │ │
│  │                             │ castillo_mysql   │  │           │ │
│  │                             │   (MySQL 8.0)    │◀─┘           │ │
│  │                             │                  │              │ │
│  │                             │  Port: 3306      │              │ │
│  │                             │                  │              │ │
│  │                             │  - castillo_db   │              │ │
│  │                             │  - Healthcheck   │              │ │
│  │                             │  - Init script   │              │ │
│  │                             └─────────┬────────┘              │ │
│  │                                       │                       │ │
│  │                                       ▼                       │ │
│  │                          ┌────────────────────┐              │ │
│  │                          │ castillo_mysql_data│              │ │
│  │                          │ (Named Volume)     │              │ │
│  │                          │ Persistent Storage │              │ │
│  │                          └────────────────────┘              │ │
│  │                                                                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

           ▲                    ▲                    ▲
           │                    │                    │
      Port 80              Port 8000            Port 3306
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────┐         ┌──────────┐         ┌──────────┐
    │ Browser  │         │   API    │         │  MySQL   │
    │  Client  │         │ Testing  │         │  Client  │
    └──────────┘         └──────────┘         └──────────┘
```

---

## 📊 FLUJO DE DATOS

```
┌─────────────┐
│   Usuario   │
│  (Browser)  │
└──────┬──────┘
       │ 1. HTTP Request (Port 80)
       ▼
┌─────────────────────┐
│  jesus_frontend     │
│  React Application  │
│  - Interfaz gráfica │
│  - Manejo de estado │
└──────┬──────────────┘
       │ 2. API Call (Port 8000)
       │    axios.get('/post_couples')
       ▼
┌──────────────────────┐
│  avendano_backend    │
│  Go REST API         │
│  - Router (Gin)      │
│  - Controllers       │
│  - Use Cases         │
└──────┬───────────────┘
       │ 3. SQL Query (Port 3306)
       │    SELECT * FROM post_couple
       ▼
┌──────────────────────┐
│  castillo_mysql      │
│  MySQL Database      │
│  - castillo_db       │
│  - post_couple table │
└──────┬───────────────┘
       │ 4. Persisted Data
       ▼
┌──────────────────────┐
│ castillo_mysql_data  │
│ Docker Volume        │
│ /var/lib/mysql       │
└──────────────────────┘
```

---

## 🔐 VARIABLES DE ENTORNO

### Backend (avendano_backend)
```yaml
DB_HOST: castillo_mysql
DB_USER: jesus_user
DB_PASS: jesus_password_secure_2025
DB_SCHEMA: castillo_db
```

### Frontend (jesus_frontend)
```yaml
VITE_API_URL: http://localhost:8000
NODE_ENV: production
```

### Base de Datos (castillo_mysql)
```yaml
MYSQL_ROOT_PASSWORD: root_password_secure_2025
MYSQL_DATABASE: castillo_db
MYSQL_USER: jesus_user
MYSQL_PASSWORD: jesus_password_secure_2025
```

---

## 🔄 CICLO DE VIDA DE LOS CONTENEDORES

```
1. docker-compose up
   │
   ├─▶ castillo_mysql (inicia primero)
   │   ├─ Crea volumen castillo_mysql_data
   │   ├─ Ejecuta init.sql
   │   ├─ Crea base de datos castillo_db
   │   ├─ Healthcheck: mysqladmin ping
   │   └─ Estado: healthy ✓
   │
   ├─▶ avendano_backend (espera a MySQL)
   │   ├─ depends_on: castillo_mysql (healthy)
   │   ├─ Build desde Dockerfile
   │   ├─ Conecta a castillo_mysql:3306
   │   ├─ Healthcheck: curl /post_couples
   │   └─ Estado: healthy ✓
   │
   └─▶ jesus_frontend (espera al Backend)
       ├─ depends_on: avendano_backend (healthy)
       ├─ Build desde Dockerfile
       ├─ Sirve aplicación React
       └─ Estado: running ✓
```

---

## 🌐 COMUNICACIÓN ENTRE SERVICIOS

### Por Nombres DNS (dentro de castillo_network)
```
jesus_frontend  ───▶  http://avendano_backend:3000
avendano_backend ───▶  mysql://castillo_mysql:3306
```

### Desde el Host (localhost)
```
Browser        ───▶  http://localhost:80        (Frontend)
API Testing    ───▶  http://localhost:8000      (Backend)
MySQL Client   ───▶  mysql://localhost:3306     (Database)
```

---

## 📦 ESTRUCTURA DE ARCHIVOS

```
microservicios/
│
├── docker-compose.yml          # Orquestación de servicios
├── init.sql                    # Script de inicialización DB
├── README.md                   # Documentación completa
├── INSTRUCCIONES.md            # Guía rápida
├── ARQUITECTURA.md             # Este archivo
├── start.bat                   # Script de inicio
├── verify.bat                  # Script de verificación
│
├── backend_microservicios/
│   ├── Dockerfile              # Build Go app
│   ├── .dockerignore           # Archivos a ignorar
│   ├── .env                    # Config local
│   ├── .env.docker             # Config Docker
│   ├── go.mod                  # Dependencias Go
│   ├── main.go                 # Punto de entrada
│   └── src/                    # Código fuente
│       ├── core/
│       │   └── db_mysql.go     # Conexión DB
│       └── post_couples/       # Módulo de posts
│           ├── domain/         # Entidades y repos
│           ├── application/    # Casos de uso
│           └── infrastructure/ # Adaptadores y controladores
│
└── frontend_microservicios/
    ├── Dockerfile              # Build React app
    ├── .dockerignore           # Archivos a ignorar
    ├── .env.production         # Config producción
    ├── package.json            # Dependencias npm
    ├── vite.config.js          # Config Vite
    └── src/                    # Código fuente React
        ├── App.jsx             # Componente principal
        ├── ui/                 # Componentes UI
        └── postcouples/        # Módulo de posts
            ├── components/     # Componentes React
            ├── pages/          # Páginas
            ├── application/    # Hooks
            └── infrastructure/ # API services
```

---

## 🛡️ HEALTHCHECKS

### castillo_mysql
```yaml
test: mysqladmin ping -h localhost -u jesus_user -p***
interval: 10s
timeout: 5s
retries: 5
start_period: 30s
```

### avendano_backend
```yaml
test: wget --spider http://localhost:3000/post_couples
interval: 30s
timeout: 10s
retries: 3
start_period: 40s
```

---

## 📏 CUMPLIMIENTO DE REQUISITOS

| Requisito | Estado | Implementación |
|-----------|--------|----------------|
| Frontend en contenedor | ✅ | React + Vite, puerto 80 |
| Backend en contenedor | ✅ | Go + Gin, puerto 8000 |
| Base de datos en contenedor | ✅ | MySQL 8.0, puerto 3306 |
| Dockerfile personalizados | ✅ | Multi-stage builds |
| docker-compose.yml | ✅ | 3 servicios configurados |
| Red interna | ✅ | castillo_network (bridge) |
| Volumen persistente | ✅ | castillo_mysql_data (named) |
| depends_on | ✅ | Con healthchecks |
| Variables de entorno | ✅ | Configuración completa |
| Nombres personalizados | ✅ | castillo, avendano, jesus |
| Nombre en frontend | ✅ | "Jesús Imanol Castillo Avendaño" |
| Base de datos con apellido | ✅ | castillo_db |

---

**Proyecto completamente documentado y funcional** 🚀
**Autor: Jesús Imanol Castillo Avendaño**
