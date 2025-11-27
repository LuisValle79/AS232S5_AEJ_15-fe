# ===============================
# ETAPA 1: Build de Vite + Node
# ===============================
FROM node:18-alpine AS build

WORKDIR /app

# Argumento para la URL del API (se pasa desde docker-compose)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# ===============================
# ETAPA 2: Nginx de producción
# ===============================
FROM nginx:alpine

# Copiar los archivos construidos a la imagen de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar el template de configuración de nginx
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copiar el script de entrypoint
COPY entrypoint.sh /entrypoint.sh

# Dar permisos de ejecución al script
RUN chmod +x /entrypoint.sh

# Variables de entorno por defecto
ENV BACKEND_PORT=9098
ENV BACKEND_HOST=backend-apis-ia

# Exponer el puerto 80
EXPOSE 80

# Usar el script personalizado como entrypoint
ENTRYPOINT ["/entrypoint.sh"]
