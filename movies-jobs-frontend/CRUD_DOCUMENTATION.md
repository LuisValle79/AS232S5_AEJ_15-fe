# CRUD API Documentation - Movies & Jobs

## 📋 Resumen de Implementación

Se ha implementado un **CRUD completo con eliminado lógico** para las entidades Movies y Jobs en tu proyecto Spring Boot reactivo.

## 🎬 Endpoints de Movies

### Base URL: `/api/movies`

#### **CREATE** - Crear Película
```
POST /api/movies
Content-Type: application/json

Body:
{
  "movieId": "unique_movie_id",
  "title": "Título de la película",
  "overview": "Descripción de la película",
  "posterPath": "url_del_poster",
  "releaseDate": "2024-01-01",
  "voteAverage": 8.5,
  "voteCount": 1000,
  "popularity": 95.5,
  "genreIds": "1,2,3"
}
```

#### **READ** - Obtener Película por ID
```
GET /api/movies/{id}
```

#### **UPDATE** - Actualizar Película
```
PUT /api/movies/{id}
Content-Type: application/json

Body:
{
  "title": "Nuevo título",
  "overview": "Nueva descripción",
  "posterPath": "nuevo_url_del_poster",
  "releaseDate": "2024-02-01",
  "voteAverage": 9.0,
  "voteCount": 1500,
  "popularity": 98.0,
  "genreIds": "1,2,4"
}
```

#### **DELETE** - Eliminado Lógico
```
DELETE /api/movies/{id}
```

#### **RESTORE** - Restaurar Película
```
PATCH /api/movies/{id}/restore
```

#### **SEARCH** - Búsquedas Avanzadas
```
GET /api/movies                    # Obtener todas las películas activas
GET /api/movies/search-by-title?title=batman    # Buscar por título
GET /api/movies/search?title=batman             # Búsqueda API externa (existente)
GET /api/movies/getID?title=batman              # Obtener por título API (existente)
```

## 💼 Endpoints de Jobs

### Base URL: `/api/jobs`

#### **CREATE** - Crear Trabajo
```
POST /api/jobs
Content-Type: application/json

Body:
{
  "jobId": "unique_job_id",
  "employerName": "Nombre de la empresa",
  "jobTitle": "Título del puesto",
  "jobDescription": "Descripción del trabajo",
  "jobCountry": "Perú",
  "jobCity": "Lima",
  "jobPostedAt": "2024-01-01",
  "jobApplyLink": "url_de_aplicacion",
  "jobEmploymentType": "Full-time"
}
```

#### **READ** - Obtener Trabajo por ID
```
GET /api/jobs/{id}
```

#### **UPDATE** - Actualizar Trabajo
```
PUT /api/jobs/{id}
Content-Type: application/json

Body:
{
  "employerName": "Nueva empresa",
  "jobTitle": "Nuevo título",
  "jobDescription": "Nueva descripción",
  "jobCountry": "Colombia",
  "jobCity": "Bogotá",
  "jobPostedAt": "2024-02-01",
  "jobApplyLink": "nuevo_url",
  "jobEmploymentType": "Part-time"
}
```

#### **DELETE** - Eliminado Lógico
```
DELETE /api/jobs/{id}
```

#### **RESTORE** - Restaurar Trabajo
```
PATCH /api/jobs/{id}/restore
```

#### **SEARCH** - Búsquedas Avanzadas
```
GET /api/jobs                               # Obtener todos los trabajos activos
GET /api/jobs/search-by-title?title=developer        # Buscar por título
GET /api/jobs/search-by-employer?employer=google     # Buscar por empresa
GET /api/jobs/search-by-country?country=peru         # Buscar por país
GET /api/jobs/search-by-city?city=lima               # Buscar por ciudad
GET /api/jobs/search?query=developer&country=us      # Búsqueda API externa (existente)
```

## 🗃️ Campos de Auditoría

Todas las entidades ahora incluyen:

- **created_at**: Timestamp de creación automático
- **updated_at**: Timestamp de actualización automático  
- **is_active**: Boolean para eliminado lógico (true = activo, false = eliminado)

## 📊 Base de Datos

### Campos Agregados a las Tablas

```sql
-- Para movies y jobs
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
is_active BOOLEAN DEFAULT TRUE
```

## 🚀 Características Implementadas

### ✅ CRUD Completo
- **Create**: Crear nuevos registros con validaciones
- **Read**: Obtener por ID y listados
- **Update**: Actualizar registros existentes
- **Delete**: Eliminado lógico (no se borran físicamente)

### ✅ Eliminado Lógico
- Los registros no se eliminan físicamente
- Se marcan como `is_active = false`
- Funcionalidad de restauración disponible
- Todas las búsquedas filtran automáticamente registros activos

### ✅ Validaciones
- Validación de campos requeridos
- Validación de formatos (decimales, enteros)
- Prevención de duplicados por IDs únicos
- Manejo de errores detallado

### ✅ Búsquedas Avanzadas
- Búsqueda por múltiples criterios
- Búsqueda insensible a mayúsculas/minúsculas
- Filtrado automático de registros activos

### ✅ Programación Reactiva
- Todos los endpoints son completamente reactivos
- Uso de Mono y Flux de Project Reactor
- Manejo asíncrono de errores

## 📝 Notas de Implementación

1. **DTOs Separados**: Se crearon DTOs específicos para Create y Update requests
2. **Repositorios Mejorados**: Queries personalizadas con R2DBC
3. **Servicios Expandidos**: Lógica de negocio completa con validaciones
4. **Controladores Completos**: Endpoints RESTful con manejo de errores
5. **Compatibilidad**: Las funcionalidades existentes de API externa se mantienen intactas

## 🔍 Ejemplos de Uso

### Crear una Película
```bash
curl -X POST http://localhost:8080/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": "movie123",
    "title": "Mi Película",
    "overview": "Una película increíble",
    "voteAverage": 8.5
  }'
```

### Buscar Trabajos por Empresa
```bash
curl "http://localhost:8080/api/jobs/search-by-employer?employer=google"
```

### Eliminar Lógicamente una Película
```bash
curl -X DELETE http://localhost:8080/api/movies/1
```

### Restaurar una Película
```bash
curl -X PATCH http://localhost:8080/api/movies/1/restore
```



### aca tambien tienes mi application.yml:     
```
spring:
  application:
    name: projectPruebasApis
  r2dbc:
    url: r2dbc:postgresql://ep-withered-cell-afl7k9xj-pooler.c-2.us-west-2.aws.neon.tech:5432/neondb?options=endpoint=ep-withered-cell-afl7k9xj
    username: neondb_owner
    password: npg_yYaKwc5E6gsr
    properties:
      sslMode: require
  server:
    port: 8080
rapidapi:
  key: ab05570ba7msh5721c89ebac0f08p1cdd10jsn93d7f9f72c33
  movie:
    host: ai-movie-recommender.p.rapidapi.com
  jsearch:
    host: jsearch.p.rapidapi.com
  youtube:
    host: youtube-media-downloader.p.rapidapi.com
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
  packages-to-scan: pe.edu.vallegrande.projectPruebasApis.controller
  paths-to-match: /api/movies/**
logging:
  level:
    org.springdoc: DEBUG
    org.springframework.web: DEBUG
```
¡El CRUD completo con eliminado lógico está listo para usar! 🎉