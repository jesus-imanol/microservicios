# Dockerfile para Backend Go - Creado por Jesús Imanol Castillo Avendaño
# Etapa 1: Build
FROM golang:1.23.4-alpine AS builder

# Instalar dependencias necesarias
RUN apk add --no-cache git

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY go.mod go.sum ./

# Descargar dependencias
RUN go mod download

# Copiar el código fuente
COPY . .

# Compilar la aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Etapa 2: Runtime
FROM alpine:latest

# Instalar certificados CA y wget para healthcheck
RUN apk --no-cache add ca-certificates wget

WORKDIR /root/

# Copiar el binario compilado desde la etapa builder
COPY --from=builder /app/main .

# No copiar .env, usar variables de entorno del docker-compose
# Las variables DB_HOST, DB_USER, DB_PASS, DB_SCHEMA se pasan por docker-compose

# Exponer el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["./main"]
