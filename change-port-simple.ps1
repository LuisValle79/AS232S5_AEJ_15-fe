# Script para cambiar puertos del backend
param(
    [Parameter(Mandatory=$true)]
    [int]$BackendPort
)

Write-Host "Cambiando puerto del backend a: $BackendPort" -ForegroundColor Cyan

# Leer y actualizar .env
$envContent = Get-Content .env
$envContent = $envContent -replace "BACKEND_PORT=\d+", "BACKEND_PORT=$BackendPort"
$envContent = $envContent -replace "VITE_API_URL=http://localhost:\d+", "VITE_API_URL=http://localhost:$BackendPort"
$envContent | Set-Content .env

Write-Host "Archivo .env actualizado" -ForegroundColor Green
Write-Host "Reiniciando aplicacion..." -ForegroundColor Yellow

# Reiniciar
docker-compose -f docker-compose.fullstack.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "Puerto cambiado exitosamente a $BackendPort!" -ForegroundColor Green
    Write-Host "URLs disponibles:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  Backend:  http://localhost:$BackendPort/api/movies" -ForegroundColor White
    Write-Host "  Swagger:  http://localhost:$BackendPort/swagger-ui.html" -ForegroundColor White
    Write-Host ""
    Write-Host "IMPORTANTE: No se reconstruyo la imagen - solo se reconfiguro nginx!" -ForegroundColor Green
} else {
    Write-Host "Error al cambiar el puerto" -ForegroundColor Red
}