# ============================================
# Script de Gestión Docker - Movies & Jobs App
# ============================================
# Autor: Luis Valle
# Descripción: Script para facilitar la gestión de contenedores Docker

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('start', 'stop', 'restart', 'logs', 'status', 'build', 'clean', 'help')]
    [string]$Action = 'help'
)

$ComposeFile = "docker-compose.fullstack.yml"

function Show-Help {
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "  Docker Manager - Movies & Jobs Application" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "`nUso: .\docker-manager.ps1 -Action <accion>`n" -ForegroundColor Yellow
    Write-Host "Acciones disponibles:" -ForegroundColor Green
    Write-Host "  start    - Iniciar la aplicación completa (Frontend + Backend)" -ForegroundColor White
    Write-Host "  stop     - Detener todos los contenedores" -ForegroundColor White
    Write-Host "  restart  - Reiniciar todos los contenedores" -ForegroundColor White
    Write-Host "  logs     - Ver logs en tiempo real" -ForegroundColor White
    Write-Host "  status   - Ver el estado de los contenedores" -ForegroundColor White
    Write-Host "  build    - Reconstruir las imágenes" -ForegroundColor White
    Write-Host "  clean    - Limpiar contenedores, imágenes y volúmenes" -ForegroundColor White
    Write-Host "  help     - Mostrar esta ayuda" -ForegroundColor White
    Write-Host "`nEjemplos:" -ForegroundColor Green
    Write-Host "  .\docker-manager.ps1 -Action start" -ForegroundColor Gray
    Write-Host "  .\docker-manager.ps1 -Action logs" -ForegroundColor Gray
    Write-Host "  .\docker-manager.ps1 -Action stop`n" -ForegroundColor Gray
}

function Start-Application {
    Write-Host "`n🚀 Iniciando aplicación completa..." -ForegroundColor Green
    docker-compose -f $ComposeFile up -d --build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Aplicación iniciada correctamente!" -ForegroundColor Green
        Write-Host "`n📍 URLs disponibles:" -ForegroundColor Cyan
        Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
        Write-Host "   Backend:   http://localhost:9098/api/movies" -ForegroundColor White
        Write-Host "   Swagger:   http://localhost:9098/swagger-ui.html`n" -ForegroundColor White
    } else {
        Write-Host "`n❌ Error al iniciar la aplicación" -ForegroundColor Red
    }
}

function Stop-Application {
    Write-Host "`n🛑 Deteniendo aplicación..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Aplicación detenida correctamente!`n" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Error al detener la aplicación`n" -ForegroundColor Red
    }
}

function Restart-Application {
    Write-Host "`n🔄 Reiniciando aplicación..." -ForegroundColor Yellow
    Stop-Application
    Start-Sleep -Seconds 2
    Start-Application
}

function Show-Logs {
    Write-Host "`n📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Cyan
    docker-compose -f $ComposeFile logs -f
}

function Show-Status {
    Write-Host "`n📊 Estado de los contenedores:" -ForegroundColor Cyan
    docker-compose -f $ComposeFile ps
    
    Write-Host "`n💾 Uso de recursos:" -ForegroundColor Cyan
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

function Build-Images {
    Write-Host "`n🔨 Reconstruyendo imágenes..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile build --no-cache
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Imágenes reconstruidas correctamente!`n" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Error al reconstruir las imágenes`n" -ForegroundColor Red
    }
}

function Clean-Docker {
    Write-Host "`n🧹 Limpiando recursos de Docker..." -ForegroundColor Yellow
    Write-Host "⚠️  Esto eliminará:" -ForegroundColor Red
    Write-Host "   - Contenedores detenidos" -ForegroundColor White
    Write-Host "   - Imágenes no utilizadas" -ForegroundColor White
    Write-Host "   - Volúmenes no utilizados" -ForegroundColor White
    Write-Host "   - Redes no utilizadas`n" -ForegroundColor White
    
    $confirmation = Read-Host "¿Estás seguro? (s/n)"
    
    if ($confirmation -eq 's' -or $confirmation -eq 'S') {
        docker system prune -a --volumes -f
        Write-Host "`n✅ Limpieza completada!`n" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Limpieza cancelada`n" -ForegroundColor Yellow
    }
}

# Ejecutar la acción solicitada
switch ($Action) {
    'start'   { Start-Application }
    'stop'    { Stop-Application }
    'restart' { Restart-Application }
    'logs'    { Show-Logs }
    'status'  { Show-Status }
    'build'   { Build-Images }
    'clean'   { Clean-Docker }
    'help'    { Show-Help }
    default   { Show-Help }
}
