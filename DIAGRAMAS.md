# Diagramas de Arquitectura y Flujo de Datos
**Proyecto de Microservicios - CouplesApp**  
**Creado por:** Jesús Imanol Castillo Avendaño

---

## 📐 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ARQUITECTURA DE MICROSERVICIOS                  │
│                   Sistema CouplesApp - Docker Compose               │
└─────────────────────────────────────────────────────────────────────┘

                            CAPA DE PRESENTACIÓN
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │          jesus_frontend_container (React + Vite)            │   │
│  │                                                              │   │
│  │  - Framework: React 19 + Vite 7 + TailwindCSS              │   │
│  │  - Puerto: 80 → 3000 (interno)                             │   │
│  │  - Función: Interfaz de usuario web                        │   │
│  │  - Dockerfile: frontend_microservicios/Dockerfile          │   │
│  │  - Build: Multi-stage (node:20-alpine)                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓ HTTP                                  │
└───────────────────────────────────────────────────────────────────────┘

                          CAPA DE APLICACIÓN (API)
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │       avendano_backend_container (Go + Gin Framework)       │   │
│  │                                                              │   │
│  │  - Framework: Go 1.23.4 + Gin                               │   │
│  │  - Puerto: 8000 → 3000 (interno)                           │   │
│  │  - Función: API REST - CRUD de Posts                       │   │
│  │  - Dockerfile: backend_microservicios/Dockerfile           │   │
│  │  - Build: Multi-stage (golang:1.23.4-alpine)               │   │
│  │  - Endpoints: /post_couples, /avendano                     │   │
│  │  - Variables de entorno:                                    │   │
│  │    • DB_HOST=castillo_mysql                                │   │
│  │    • DB_USER=jesus_user                                    │   │
│  │    • DB_PASS=jesus_password_secure_2025                    │   │
│  │    • DB_SCHEMA=castillo_db                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           ↓ MySQL Protocol                           │
└───────────────────────────────────────────────────────────────────────┘

                          CAPA DE PERSISTENCIA
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           castillo_mysql_container (MySQL 8.0)              │   │
│  │                                                              │   │
│  │  - Motor: MySQL 8.0                                         │   │
│  │  - Puerto: 3306                                             │   │
│  │  - Base de datos: castillo_db                               │   │
│  │  - Usuario: jesus_user                                      │   │
│  │  - Volumen: castillo_mysql_data                            │   │
│  │  - Persistencia: /var/lib/mysql                            │   │
│  │  - Init Script: init.sql                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│                    ┌─────────────────────┐                          │
│                    │  Volumen Persistente │                          │
│                    │ castillo_mysql_data  │                          │
│                    │   (Docker Volume)    │                          │
│                    └─────────────────────┘                          │
└───────────────────────────────────────────────────────────────────────┘

                          RED INTERNA
┌───────────────────────────────────────────────────────────────────────┐
│                       castillo_network (bridge)                       │
│                                                                       │
│  Permite comunicación por nombre de servicio:                        │
│  • Frontend se comunica con Backend vía HTTP                         │
│  • Backend se comunica con MySQL vía TCP/IP                          │
│  • Aislamiento de red del host                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Diagrama de Flujo de Datos - Operación CRUD

### Flujo 1: Obtener Todos los Posts (GET)

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│          │   1. HTTP GET  │          │   2. SQL       │          │
│ FRONTEND │ ─────────────→ │ BACKEND  │ ─────────────→ │  MySQL   │
│ (React)  │                │   (Go)   │                │  (DB)    │
│          │                │          │                │          │
│  Puerto  │                │  Puerto  │                │  Puerto  │
│   :80    │                │  :8000   │                │  :3306   │
│          │                │          │                │          │
│          │ ←───────────── │          │ ←───────────── │          │
│          │   4. JSON      │          │   3. Rows      │          │
└──────────┘                └──────────┘                └──────────┘

Detalles del flujo:
1. Usuario accede a http://54.152.217.38
   Frontend hace: GET http://54.152.217.38:8000/post_couples

2. Backend recibe petición en /post_couples
   Ejecuta: SELECT * FROM post_couple ORDER BY fecha_publicacion DESC

3. MySQL retorna filas de la tabla post_couple
   Incluye: id, titulo, contenido, etiquetas, num_me_gusta, etc.

4. Backend serializa a JSON y envía respuesta:
   {
     "data": [
       {"id": 1, "titulo": "...", "contenido": "...", ...},
       {"id": 2, "titulo": "...", "contenido": "...", ...}
     ]
   }

5. Frontend renderiza los posts en la interfaz
```

---

### Flujo 2: Crear un Nuevo Post (POST)

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│          │   1. HTTP POST │          │   2. SQL       │          │
│ FRONTEND │ ─────────────→ │ BACKEND  │ ─────────────→ │  MySQL   │
│          │   + JSON Body  │          │   INSERT       │          │
│          │                │          │                │          │
│          │                │ Valida   │                │ Guarda   │
│          │                │ Datos    │                │ Registro │
│          │                │          │                │          │
│          │ ←───────────── │          │ ←───────────── │          │
│          │   4. Success   │          │  3. Insert ID  │          │
└──────────┘                └──────────┘                └──────────┘

Detalles del flujo:
1. Usuario llena formulario y presiona "Crear publicación"
   Frontend envía: POST http://54.152.217.38:8000/post_couples
   Body: {
     "titulo": "Mi historia",
     "contenido": "Texto del post...",
     "etiquetas": ["amor", "viaje"],
     "categoria": "Romance",
     "nombre_anonimo": "jesuscast7x"
   }

2. Backend valida datos y prepara consulta SQL:
   INSERT INTO post_couple (titulo, contenido, etiquetas, categoria, 
                            nombre_anonimo, fecha_publicacion, num_me_gusta)
   VALUES (?, ?, ?, ?, ?, NOW(), 0)

3. MySQL ejecuta INSERT y retorna el ID generado

4. Backend responde:
   {"message": "Post creado exitosamente", "id": 4}

5. Frontend muestra mensaje de éxito y refresca la lista
```

---

### Flujo 3: Dar "Me Gusta" a un Post (PATCH)

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│          │  1. HTTP PATCH │          │   2. SQL       │          │
│ FRONTEND │ ─────────────→ │ BACKEND  │ ─────────────→ │  MySQL   │
│          │  /post/:id/like│          │   UPDATE       │          │
│          │                │          │                │          │
│          │                │ Extrae   │                │ Incrementa│
│          │                │ ID       │                │ Contador  │
│          │                │          │                │          │
│          │ ←───────────── │          │ ←───────────── │          │
│          │   4. Success   │          │  3. Affected   │          │
└──────────┘                └──────────┘                └──────────┘

Detalles del flujo:
1. Usuario hace clic en el botón de corazón ❤️
   Frontend envía: PATCH http://54.152.217.38:8000/post_couples/3/like

2. Backend extrae ID=3 de la URL y ejecuta:
   UPDATE post_couple 
   SET num_me_gusta = num_me_gusta + 1 
   WHERE id_post = 3

3. MySQL incrementa el contador atómicamente

4. Backend responde: {"message": "Like incrementado"}

5. Frontend actualiza el contador en la UI (optimistic update)
```

---

## 🌐 Diagrama de Comunicación de Red

```
┌─────────────────────────────────────────────────────────────────┐
│                      HOST (AWS EC2 / Local)                     │
│                                                                 │
│  Puerto 80 ──┐                                                 │
│              │                                                  │
│  Puerto 8000 ┼──► Docker Engine                               │
│              │                                                  │
│  Puerto 3306 ──┘                                               │
│                          │                                      │
│                          ▼                                      │
│   ┌─────────────────────────────────────────────────────┐     │
│   │      castillo_network (172.18.0.0/16)               │     │
│   │                                                      │     │
│   │   ┌────────────────┐                                │     │
│   │   │  jesus_frontend│                                │     │
│   │   │  172.18.0.2    │                                │     │
│   │   │  :3000 (int)   │                                │     │
│   │   └────────┬───────┘                                │     │
│   │            │                                         │     │
│   │            │ HTTP Request                            │     │
│   │            │ http://54.152.217.38:8000               │     │
│   │            │                                         │     │
│   │            ▼                                         │     │
│   │   ┌────────────────┐                                │     │
│   │   │ avendano_backend│                               │     │
│   │   │  172.18.0.3    │                                │     │
│   │   │  :3000 (int)   │                                │     │
│   │   └────────┬───────┘                                │     │
│   │            │                                         │     │
│   │            │ MySQL Connection                        │     │
│   │            │ castillo_mysql:3306                     │     │
│   │            │                                         │     │
│   │            ▼                                         │     │
│   │   ┌────────────────┐                                │     │
│   │   │ castillo_mysql │                                │     │
│   │   │  172.18.0.4    │                                │     │
│   │   │  :3306 (int)   │                                │     │
│   │   └────────┬───────┘                                │     │
│   │            │                                         │     │
│   │            ▼                                         │     │
│   │   ┌────────────────┐                                │     │
│   │   │ Volume Storage │                                │     │
│   │   │castillo_mysql_d│                                │     │
│   │   └────────────────┘                                │     │
│   └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘

Acceso externo:
• Usuario → http://54.152.217.38 → jesus_frontend:80
• Usuario → http://54.152.217.38:8000 → avendano_backend:8000
```

---

## 📊 Diagrama de Dependencias y Orden de Arranque

```
                    docker-compose up -d
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  1. Crear Red: castillo_network   │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │ 2. Crear Volumen: castillo_mysql_ │
        │           data                     │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │ 3. Iniciar: castillo_mysql        │
        │    - Esperar healthcheck          │
        │    - Ejecutar init.sql            │
        └───────────────────────────────────┘
                            │
                   ┌────────┴────────┐
                   │  HEALTHCHECK    │
                   │  mysqladmin ping│
                   │  ✓ Healthy      │
                   └────────┬────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │ 4. Iniciar: avendano_backend      │
        │    - depends_on: mysql healthy    │
        │    - Conectar a DB                │
        │    - Esperar healthcheck          │
        └───────────────────────────────────┘
                            │
                   ┌────────┴────────┐
                   │  HEALTHCHECK    │
                   │  wget /post_    │
                   │  couples        │
                   │  ✓ Healthy      │
                   └────────┬────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │ 5. Iniciar: jesus_frontend        │
        │    - depends_on: backend healthy  │
        │    - Servir aplicación React      │
        └───────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  SISTEMA LISTO          │
              │  ✓ Todos los servicios  │
              │    funcionando          │
              └─────────────────────────┘
```

---

## 🔐 Diagrama de Persistencia de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                  CICLO DE VIDA DE DATOS                     │
└─────────────────────────────────────────────────────────────┘

1. ESCRITURA DE DATOS
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │ Frontend │ ───→ │ Backend  │ ───→ │  MySQL   │
   │          │ POST │          │ SQL  │Container │
   └──────────┘      └──────────┘      └─────┬────┘
                                              │
                                              ▼
                                        ┌──────────┐
                                        │  Volume  │
                                        │ /var/lib/│
                                        │  mysql   │
                                        └──────────┘
                                              │
                                              ▼
                                        ┌──────────┐
                                        │  Host FS │
                                        │  (Disk)  │
                                        └──────────┘

2. REINICIO DE CONTENEDOR (docker-compose restart)
   ┌──────────┐
   │  MySQL   │ STOP
   │Container │ ────┐
   └──────────┘     │
                    │  Contenedor se detiene
                    │  pero el volumen persiste
                    │
                    ▼
   ┌──────────┐     ┌──────────┐
   │  Volume  │ ──→ │  Host FS │
   │Permanece │     │  (Disk)  │
   └──────────┘     └──────────┘
        │
        │  docker-compose up -d
        │
        ▼
   ┌──────────┐
   │  MySQL   │ START - Monta volumen existente
   │Container │ ←──── Datos intactos
   └──────────┘

3. ELIMINACIÓN COMPLETA (docker-compose down -v)
   ┌──────────┐
   │  MySQL   │ REMOVE
   │Container │ ────┐
   └──────────┘     │
                    ▼
   ┌──────────┐     ┌──────────┐
   │  Volume  │ ──→ │  Host FS │
   │ DELETED  │     │ DELETED  │
   └──────────┘     └──────────┘
        ⚠️ DATOS PERDIDOS ⚠️
```

---

## 🔄 Diagrama de Endpoints de la API

```
┌────────────────────────────────────────────────────────────────┐
│            API REST - avendano_backend_container               │
│                  http://54.152.217.38:8000                     │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ENDPOINTS CRUD - Posts                                         │
├─────────────────┬───────────────────────────────────────────────┤
│ GET             │ /post_couples                                 │
│                 │ Obtener todos los posts                       │
│                 │ Response: {"data": [posts...]}                │
├─────────────────┼───────────────────────────────────────────────┤
│ GET             │ /post_couples/tag/:tag                        │
│                 │ Buscar posts por etiqueta                     │
│                 │ Ejemplo: /post_couples/tag/amor               │
├─────────────────┼───────────────────────────────────────────────┤
│ POST            │ /post_couples                                 │
│                 │ Crear nuevo post                              │
│                 │ Body: {titulo, contenido, etiquetas, ...}     │
├─────────────────┼───────────────────────────────────────────────┤
│ PUT             │ /post_couples/:id                             │
│                 │ Actualizar post existente                     │
│                 │ Ejemplo: /post_couples/3                      │
├─────────────────┼───────────────────────────────────────────────┤
│ PATCH           │ /post_couples/:id/like                        │
│                 │ Incrementar contador de "me gusta"            │
│                 │ Ejemplo: /post_couples/3/like                 │
├─────────────────┼───────────────────────────────────────────────┤
│ DELETE          │ /post_couples/:id                             │
│                 │ Eliminar post                                 │
│                 │ Ejemplo: /post_couples/3                      │
└─────────────────┴───────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ENDPOINT PERSONAL                                              │
├─────────────────┬───────────────────────────────────────────────┤
│ GET             │ /avendano                                     │
│                 │ Retorna nombre completo del creador          │
│                 │ Response: {                                   │
│                 │   "nombre_completo": "Jesús Imanol           │
│                 │                       Castillo Avendaño",     │
│                 │   "mensaje": "Creador del sistema...",        │
│                 │   "fecha": "2025"                             │
│                 │ }                                             │
└─────────────────┴───────────────────────────────────────────────┘
```

---

## 📈 Métricas y Configuración

```
┌─────────────────────────────────────────────────────────────────┐
│                  CONFIGURACIÓN DE SERVICIOS                     │
├─────────────────┬───────────────────────────────────────────────┤
│ Frontend        │ • Imagen: node:20-alpine (builder)           │
│ (jesus_frontend)│ • Puerto: 80:3000                             │
│                 │ • Restart: always                             │
│                 │ • Network: castillo_network                   │
│                 │ • Depends: avendano_backend (healthy)         │
├─────────────────┼───────────────────────────────────────────────┤
│ Backend         │ • Imagen: golang:1.23.4-alpine (builder)      │
│ (avendano_      │ • Puerto: 8000:3000                           │
│  backend)       │ • Restart: always                             │
│                 │ • Network: castillo_network                   │
│                 │ • Depends: castillo_mysql (healthy)           │
│                 │ • Healthcheck: wget /post_couples (30s)       │
│                 │ • Env vars: DB_HOST, DB_USER, DB_PASS, ...    │
├─────────────────┼───────────────────────────────────────────────┤
│ Database        │ • Imagen: mysql:8.0                           │
│ (castillo_mysql)│ • Puerto: 3306:3306                           │
│                 │ • Restart: always                             │
│                 │ • Network: castillo_network                   │
│                 │ • Volume: castillo_mysql_data:/var/lib/mysql  │
│                 │ • Healthcheck: mysqladmin ping (10s)          │
│                 │ • Init script: init.sql                       │
└─────────────────┴───────────────────────────────────────────────┘
```

---

## 🎯 Conclusión

Esta arquitectura implementa:
- ✅ **Separación de responsabilidades**: Frontend, Backend y DB en contenedores independientes
- ✅ **Comunicación por red interna**: Contenedores se comunican por nombre
- ✅ **Persistencia de datos**: Volumen nombrado para MySQL
- ✅ **Dependencias controladas**: Healthchecks y depends_on
- ✅ **Escalabilidad**: Fácil agregar más microservicios
- ✅ **Portabilidad**: Se ejecuta en cualquier entorno con Docker

**Autor:** Jesús Imanol Castillo Avendaño  
**Fecha:** Octubre 2025
