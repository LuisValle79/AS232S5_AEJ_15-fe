# ===============================
# ETAPA 1: Build de Vite + Node
# ===============================
FROM node:18-alpine AS build

WORKDIR /app

ARG BACKEND_PORT
ENV BACKEND_PORT=${BACKEND_PORT}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ===============================
# ETAPA 2: Nginx de producción
# ===============================
FROM nginx:alpine

# Copiar el build generado
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar el template correcto
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Generar config final
CMD envsubst '${BACKEND_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf \
    && nginx -g 'daemon off;'

EXPOSE 80
