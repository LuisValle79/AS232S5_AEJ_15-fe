#!/bin/sh

# Script de arranque para nginx con variables de entorno
# Reemplaza los placeholders en el template de nginx con valores reales

echo "🚀 Iniciando configuración de nginx..."

# Establecer valores por defecto si no están definidos
BACKEND_PORT=${BACKEND_PORT:-9098}
BACKEND_HOST=${BACKEND_HOST:-backend-apis-ia}

echo "📡 Configurando proxy hacia: ${BACKEND_HOST}:${BACKEND_PORT}"

# Crear el archivo de configuración final desde el template
sed -e "s/__BACKEND_PORT__/${BACKEND_PORT}/g" \
    -e "s/__BACKEND_HOST__/${BACKEND_HOST}/g" \
    /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "✅ Configuración de nginx completada"
echo "🔍 Configuración generada:"
echo "   Backend Host: ${BACKEND_HOST}"
echo "   Backend Port: ${BACKEND_PORT}"
echo "   Proxy URL: http://${BACKEND_HOST}:${BACKEND_PORT}"

# Verificar que la configuración de nginx es válida
echo "🧪 Verificando configuración de nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuración de nginx válida"
    echo "🌐 Iniciando nginx..."
    exec nginx -g "daemon off;"
else
    echo "❌ Error en la configuración de nginx"
    exit 1
fi