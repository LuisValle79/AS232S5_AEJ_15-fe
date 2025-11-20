# Etapa de construcción
FROM node:18-alpine AS build

WORKDIR /app

# Argumento para la URL del API (se pasa desde docker-compose)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos construidos a la imagen de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar archivo de configuración personalizado de nginx (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]