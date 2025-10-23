# Dockerfile para Frontend React - Creado por Jesús Imanol Castillo Avendaño
# Etapa 1: Build
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Argumento para la URL del backend (se pasa desde docker-compose)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Runtime con servidor Node simple
FROM node:20-alpine

WORKDIR /app

# Instalar serve para servir archivos estáticos
RUN npm install -g serve

# Copiar archivos construidos desde la etapa builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto 3000
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]
