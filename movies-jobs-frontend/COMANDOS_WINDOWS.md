# 🪟 Comandos Útiles para Windows - Docker

## 🎯 Comandos Básicos PowerShell

### Navegar entre directorios
```powershell
# Ir al backend
cd C:\Pruebas Apis\pruebasapis\AS232S5_AEJ_15-be

# Ir al frontend
cd C:\Pruebas Apis\pruebasapis\AS232S5_AEJ_15-fe

# Volver al directorio anterior
cd ..

# Ver directorio actual
pwd
```

### Ver archivos
```powershell
# Listar archivos
ls

# Listar con detalles
ls -la

# Ver contenido de un archivo
cat .env
cat docker-compose.yml
```

---

## 🐳 Comandos Docker

### Gestión de Contenedores
```powershell
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Detener un contenedor
docker stop frontend-movies-jobs
docker stop backend-apis-ia

# Iniciar un contenedor
docker start frontend-movies-jobs
docker start backend-apis-ia

# Reiniciar un contenedor
docker restart frontend-movies-jobs
docker restart backend-apis-ia

# Eliminar un contenedor
docker rm frontend-movies-jobs
docker rm backend-apis-ia

# Eliminar un contenedor forzadamente
docker rm -f frontend-movies-jobs
```

### Ver Logs
```powershell
# Ver logs de un contenedor
docker logs frontend-movies-jobs
docker logs backend-apis-ia

# Ver logs en tiempo real
docker logs -f frontend-movies-jobs
docker logs -f backend-apis-ia

# Ver últimas 100 líneas
docker logs --tail 100 frontend-movies-jobs

# Ver logs con timestamps
docker logs -t frontend-movies-jobs
```

### Entrar a un Contenedor
```powershell
# Entrar al contenedor del frontend
docker exec -it frontend-movies-jobs sh

# Entrar al contenedor del backend
docker exec -it backend-apis-ia sh

# Salir del contenedor
exit
```

### Gestión de Imágenes
```powershell
# Ver imágenes
docker images

# Eliminar una imagen
docker rmi luisvalle1/backend-apis-ia:latest

# Eliminar imágenes no usadas
docker image prune

# Eliminar todas las imágenes no usadas
docker image prune -a
```

### Gestión de Redes
```powershell
# Ver redes
docker network ls

# Inspeccionar una red
docker network inspect fullstack-network

# Eliminar una red
docker network rm fullstack-network
```

### Gestión de Volúmenes
```powershell
# Ver volúmenes
docker volume ls

# Eliminar volúmenes no usados
docker volume prune

# Eliminar un volumen específico
docker volume rm nombre_volumen
```

---

## 🔧 Docker Compose

### Comandos Básicos
```powershell
# Levantar servicios
docker-compose -f docker-compose.fullstack.yml up -d

# Levantar y reconstruir
docker-compose -f docker-compose.fullstack.yml up -d --build

# Detener servicios
docker-compose -f docker-compose.fullstack.yml down

# Detener y eliminar volúmenes
docker-compose -f docker-compose.fullstack.yml down -v

# Ver logs
docker-compose -f docker-compose.fullstack.yml logs -f

# Ver estado
docker-compose -f docker-compose.fullstack.yml ps

# Reiniciar servicios
docker-compose -f docker-compose.fullstack.yml restart

# Reconstruir imágenes
docker-compose -f docker-compose.fullstack.yml build --no-cache
```

### Comandos para Servicios Específicos
```powershell
# Logs solo del frontend
docker-compose -f docker-compose.fullstack.yml logs -f frontend-movies-jobs

# Logs solo del backend
docker-compose -f docker-compose.fullstack.yml logs -f backend-apis-ia

# Reiniciar solo el frontend
docker-compose -f docker-compose.fullstack.yml restart frontend-movies-jobs

# Reiniciar solo el backend
docker-compose -f docker-compose.fullstack.yml restart backend-apis-ia
```

---

## 🧹 Limpieza de Docker

### Limpieza Básica
```powershell
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no usadas
docker image prune

# Eliminar volúmenes no usados
docker volume prune

# Eliminar redes no usadas
docker network prune
```

### Limpieza Completa
```powershell
# Eliminar TODO lo no usado (¡CUIDADO!)
docker system prune -a --volumes

# Ver espacio usado por Docker
docker system df
```

---

## 📊 Monitoreo

### Ver Recursos
```powershell
# Ver uso de recursos en tiempo real
docker stats

# Ver uso de recursos (snapshot)
docker stats --no-stream

# Ver uso de un contenedor específico
docker stats frontend-movies-jobs
```

### Inspeccionar Contenedores
```powershell
# Ver información completa de un contenedor
docker inspect frontend-movies-jobs

# Ver solo la IP del contenedor
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' frontend-movies-jobs

# Ver el estado de salud
docker inspect --format='{{.State.Health.Status}}' backend-apis-ia
```

---

## 🌐 Comandos de Red

### Probar Conectividad
```powershell
# Hacer ping a localhost
ping localhost

# Probar puerto con curl (si tienes curl instalado)
curl http://localhost:3000
curl http://localhost:9098/api/movies

# Probar puerto con Invoke-WebRequest (PowerShell nativo)
Invoke-WebRequest -Uri http://localhost:3000
Invoke-WebRequest -Uri http://localhost:9098/api/movies
```

### Ver Puertos en Uso
```powershell
# Ver todos los puertos en uso
netstat -ano

# Ver solo puertos específicos
netstat -ano | findstr :3000
netstat -ano | findstr :9098

# Ver qué proceso está usando un puerto
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Get-Process -Id (Get-NetTCPConnection -LocalPort 9098).OwningProcess
```

---

## 🔍 Troubleshooting

### Docker no responde
```powershell
# Reiniciar Docker Desktop
# (Desde la interfaz gráfica o)
Restart-Service docker

# Ver estado de Docker
docker info
docker version
```

### Puerto ocupado
```powershell
# Ver qué está usando el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número del proceso)
taskkill /PID <PID> /F

# Ejemplo:
taskkill /PID 12345 /F
```

### Permisos
```powershell
# Ejecutar PowerShell como Administrador
# Click derecho en PowerShell > "Ejecutar como administrador"

# Verificar si eres administrador
([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
```

---

## 📝 Comandos del Script PowerShell

```powershell
# Dar permisos de ejecución al script (si es necesario)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Usar el script
.\docker-manager.ps1 -Action start
.\docker-manager.ps1 -Action stop
.\docker-manager.ps1 -Action restart
.\docker-manager.ps1 -Action logs
.\docker-manager.ps1 -Action status
.\docker-manager.ps1 -Action build
.\docker-manager.ps1 -Action clean
.\docker-manager.ps1 -Action help
```

---

## 🎯 Atajos Útiles

### Crear Alias en PowerShell
```powershell
# Agregar al perfil de PowerShell
notepad $PROFILE

# Agregar estos alias:
function dps { docker ps }
function dlog { docker logs -f $args }
function dexec { docker exec -it $args sh }
function dcup { docker-compose -f docker-compose.fullstack.yml up -d --build }
function dcdown { docker-compose -f docker-compose.fullstack.yml down }
function dclogs { docker-compose -f docker-compose.fullstack.yml logs -f }

# Recargar el perfil
. $PROFILE
```

### Usar los Alias
```powershell
dps                    # docker ps
dlog frontend-movies-jobs    # docker logs -f frontend-movies-jobs
dcup                   # levantar todo
dcdown                 # detener todo
dclogs                 # ver logs
```

---

## 🚀 Comandos Rápidos para el Día a Día

```powershell
# Iniciar todo
cd C:\Pruebas Apis\pruebasapis\AS232S5_AEJ_15-fe
.\docker-manager.ps1 -Action start

# Ver logs
.\docker-manager.ps1 -Action logs

# Ver estado
.\docker-manager.ps1 -Action status

# Reiniciar
.\docker-manager.ps1 -Action restart

# Detener
.\docker-manager.ps1 -Action stop
```

---

## 📚 Recursos Adicionales

- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/)
- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)

---

**💡 Tip**: Guarda este archivo como referencia rápida para tus comandos diarios.
