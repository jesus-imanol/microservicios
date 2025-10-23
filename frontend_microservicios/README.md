# CouplesApp Frontend 💕

Frontend moderno para el microservicio de publicaciones de parejas (Post Couples). Construido con React, Vite, TanStack Query y un diseño estilo Instagram en blanco y negro.

## 🚀 Características

- ✨ **UI Estilo Instagram**: Diseño minimalista monocromático
- 📱 **Responsive Design**: Adaptable a todos los dispositivos
- 🔄 **TanStack Query**: Manejo eficiente del estado del servidor
- 🎨 **Componentes Reutilizables**: Arquitectura limpia y modular
- ⚡ **Vite**: Build tool ultrarrápido
- 🎭 **GSAP Animations**: Animaciones suaves y profesionales

## 📦 Tecnologías

- React 19.1.1
- Vite 7.1.7
- TanStack Query (React Query) 5.90.5
- Tailwind CSS 4.1.15
- Axios
- React Hook Form
- Lucide React (Iconos)
- GSAP

## 🏗️ Arquitectura

```
src/
├── postcouples/
│   ├── application/
│   │   └── hooks/              # Custom hooks con TanStack Query
│   │       ├── usePosts.js
│   │       ├── useCreatePost.js
│   │       ├── useUpdatePost.js
│   │       ├── useDeletePost.js
│   │       └── usePostsByTag.js
│   ├── components/             # Componentes específicos de Posts
│   │   ├── PostCard.jsx
│   │   ├── PostFeed.jsx
│   │   ├── CreatePostDialog.jsx
│   │   ├── EditPostDialog.jsx
│   │   └── SearchBar.jsx
│   ├── pages/                  # Páginas
│   │   └── PostsPage.jsx
│   └── infrastructure/
│       └── api/                # Configuración API y servicios
│           ├── config.js
│           └── postCouplesService.js
└── ui/                         # Componentes UI base (estilo shadcn/ui)
    ├── Card.jsx
    ├── Button.jsx
    ├── Input.jsx
    ├── Textarea.jsx
    ├── Badge.jsx
    ├── Dialog.jsx
    └── AlertDialog.jsx
```

## 🛠️ Instalación

1. **Instalar dependencias**

```bash
npm install
```

2. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080
```

3. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🔌 Backend Integration

Asegúrate de que el backend de Go esté corriendo en el puerto 8080 con los siguientes endpoints:

- `GET /posts` - Obtener todos los posts
- `GET /posts/:id` - Obtener un post por ID
- `GET /posts/tag/:tag` - Buscar posts por tag
- `POST /posts` - Crear un nuevo post
- `PUT /posts/:id` - Actualizar un post
- `DELETE /posts/:id` - Eliminar un post

## 📝 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Preview del build de producción
npm run lint     # Ejecuta ESLint
```

## 🎨 Funcionalidades

### 1. Feed Principal
- Grid responsive de posts
- Cards estilo Instagram
- Animaciones suaves
- Estados de carga con skeletons

### 2. Crear Post
- Modal elegante
- Validación de formularios
- Agregar tags dinámicamente
- Feedback visual

### 3. Buscar Posts
- Búsqueda por tags
- Resultados en tiempo real
- Limpiar búsqueda fácilmente

### 4. Editar Post
- Modal con datos precargados
- Mismas validaciones que crear
- Actualización optimista

### 5. Eliminar Post
- Confirmación con AlertDialog
- Actualización optimista de UI
- Rollback en caso de error

## 🎨 Tema y Diseño

El diseño sigue los principios de Instagram:
- **Colores**: Escala de grises (negro, blanco, grises)
- **Tipografía**: System fonts (-apple-system, Segoe UI, Roboto)
- **Espaciado**: Generoso y limpio
- **Bordes**: Sutiles (#dbdbdb)
- **Sombras**: Mínimas y elegantes

## 🔄 Estado del Servidor (TanStack Query)

Todos los datos del servidor se manejan con TanStack Query:
- **Caché inteligente**: Reduce llamadas innecesarias
- **Actualización automática**: Refetch al cambiar de ventana
- **Optimistic updates**: UI actualizada instantáneamente
- **Rollback automático**: En caso de errores

## 📱 Responsive Design

- **Mobile**: 1 columna
- **Tablet**: 2 columnas
- **Desktop**: 3 columnas

---

**Desarrollado con ❤️ usando React + Vite**
