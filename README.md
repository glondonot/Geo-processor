# GeoProcessor - Geospatial Processing Application

A full-stack application for geographic data processing, providing tools for coordinate management, centroid calculation, and boundary determination.

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
  - [Repository Structure - Monorepo Approach](#repository-structure---monorepo-approach)
  - [Network Architecture and Security](#network-architecture-and-security)
  - [Technical Stack](#technical-stack)
- [Features & Implementation Decisions](#features--implementation-decisions)
  - [Architecture Decisions](#architecture-decisions)
  - [Frontend Design Decisions](#frontend-design-decisions)
  - [Backend Design Decisions](#backend-design-decisions)
  - [API Gateway Decisions](#api-gateway-decisions)
- [Running the Application](#running-the-application)
  - [Prerequisites](#prerequisites)
  - [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
  - [Backend API Endpoints](#backend-api-endpoints)
  - [API Gateway Endpoints](#api-gateway-endpoints)
- [Testing](#testing)
- [Contact](#contact)

## Overview

GeoProcessor is a professional geospatial data processing application built as a technical challenge. The application allows users to:

- Input geographic coordinates (latitude/longitude)
- Visualize points on an interactive map
- Calculate the centroid (geometric center) of points
- Determine the bounding box (north, south, east, west limits)
- Export results in JSON and CSV formats

## Screenshots

### Main Interface
![Main Interface](docs/images/main-interface.png)

### Map Visualization
![Map View](docs/images/map-view.png)

### Coordinates Panel
![Coordinates Panel](docs/images/coords-panel.png)

### Results Panel
![Results Panel](docs/images/results-panel.png)

## Architecture

### Repository Structure - Monorepo Approach

This project uses a monorepo architecture to house all services in a single repository, which offers several advantages:

**Rationale for Monorepo:**
- **Simplified Dependency Management**: Shared dependencies can be managed more efficiently
- **Atomic Changes**: Ability to make cross-service changes in a single commit
- **Improved Collaboration**: Easier for developers to understand the entire system
- **Simplified CI/CD**: Unified pipelines for testing and deployment
- **Version Consistency**: All services are inherently versioned together, ensuring compatibility
- **Containerization Synergy**: Docker and Docker Compose integration is streamlined with a monorepo, allowing for centralized container orchestration and networking
- **Development Consistency**: Developers can run the entire application stack locally with a single command

```
Geo-processor/
├── docker-compose.yml      # Container orchestration with network segmentation
├── README.md               # Project documentation
├── services/               # All application services
│   ├── api-gateway/        # NestJS API Gateway service with Redis caching
│   ├── backend/            # Python FastAPI backend service (isolated network)
│   └── frontend/           # Next.js frontend service
├── redis/                  # Persistent Redis cache container configuration
├── .github/                # CI/CD workflows and GitHub configurations
└── .docker/                # Docker configuration files and environment settings
```

### Network Architecture and Security

The application utilizes Docker network segmentation to enforce a secure communication pattern:

```
                    │                │
                    │                │
 ┌─────────────┐    │    ┌──────┐    │    ┌─────────┐
 │             │    │    │      │    │    │         │
 │   Client    ├────┼───►│  API │    │    │ Backend │
 │             │    │    │ Gate │◄───┼───►│ Service │
 └─────────────┘    │    │ way  │    │    │         │
                    │    │      │    │    └─────────┘
                    │    └──┬───┘    │
                    │       │        │
                    │       ▼        │
                    │    ┌──────┐    │
                    │    │      │    │
                    │    │Redis │    │
                    │    │Cache │    │
                    │    │      │    │
                    │    └──────┘    │
                    │                │
                    │  Public Net    │  Private Net
                    └────────────────┘
```

This architecture ensures that backend services are not directly accessible from the public network, adding a crucial security layer.

### Technical Stack

The application is built on a modern, scalable tech stack:

#### Backend (Python FastAPI)
- **FastAPI**: High-performance Python framework
- **Pydantic**: Data validation and settings management
- **Pytest**: Comprehensive testing framework
- **Docker**: Containerization for consistency and portability

#### API Gateway (NestJS)
- **NestJS**: Progressive Node.js framework for building server-side applications
- **TypeScript**: Type safety and enhanced developer experience
- **Redis**: In-memory data caching for improved performance with persistent storage
- **Jest**: Testing framework for Node.js
- **Swagger**: API documentation

#### Frontend (Next.js)
- **Next.js**: React framework for production
- **React**: Component-based UI library
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Leaflet**: Interactive maps
- **React Hook Form**: Form validation and handling

## Features & Implementation Decisions

### Architecture Decisions

1. **Microservices Architecture**:
   - **Rationale**: Each component (frontend, API gateway, backend) runs as a separate service to enable independent scaling and deployment.
   - **Benefit**: Improved maintainability and flexibility for future enhancements.

2. **API Gateway Pattern with Network Segmentation**:
   - **Rationale**: NestJS serves as an API gateway to route requests to the appropriate services, with network segmentation implemented to protect backend services.
   - **Benefit**: Centralized request handling, authentication, and cross-cutting concerns.
   - **Security**: Backend services are isolated in separate Docker networks, preventing direct external access and ensuring all traffic must flow through the API Gateway.

3. **Containerization with Docker and Network Security**:
   - **Rationale**: Each service is containerized for environment consistency and integrates seamlessly within the monorepo structure.
   - **Benefit**: "Works on my machine" problems are eliminated, deployment is simplified, and the entire system can be launched with a single command.
   - **Implementation**: Docker Compose orchestrates all services including a dedicated Redis cache container with data persistence volumes, ensuring cached data survives container restarts. Optimized Dockerfiles for each service minimize image size and startup time.
   - **Network Segmentation**: Implemented distinct Docker networks to isolate services: the backend API is only accessible through the API Gateway, not directly from external clients, enhancing security.

### Frontend Design Decisions

1. **Responsive UI with Tailwind CSS**:
   - **Rationale**: Used utility-first CSS approach for rapid development and consistent styling.
   - **Benefit**: Application works seamlessly across desktop and mobile devices with minimal custom CSS.

2. **Component Architecture**:
   - **Rationale**: The UI is broken down into reusable, focused components.
   - **Benefit**: Improves maintainability and makes the codebase more modular.

3. **Client-side Form Validation**:
   - **Rationale**: Implemented thorough input validation using React Hook Form.
   - **Benefit**: Prevents invalid data submissions and provides immediate user feedback.

4. **Dark Mode Support**:
   - **Rationale**: Implemented system-preference-based theme switching.
   - **Benefit**: Enhances user experience in different lighting conditions and respects user preferences.

5. **Dynamic Map Visualization**:
   - **Rationale**: Leveraged Leaflet for interactive maps with dynamic markers and boundaries.
   - **Benefit**: Users can visually understand the geographic data they're working with.

6. **Progressive Enhancement**:
   - **Rationale**: Core functionality works without JavaScript, with enhanced features when available.
   - **Benefit**: Improved accessibility and performance across devices.

### Backend Design Decisions

1. **FastAPI for Python Backend**:
   - **Rationale**: Selected for its performance, automatic OpenAPI documentation, and native async support.
   - **Benefit**: High throughput with minimal code, built-in validation, and self-documenting APIs.

3. **Data Validation**:
   - **Rationale**: Rigorous input/output validation using Pydantic models.
   - **Benefit**: Type safety, automatic validation, and clear error messages.

4. **Comprehensive Testing**:
   - **Rationale**: Unit and integration tests cover key functionality.
   - **Benefit**: Ensures reliability and makes refactoring safer.

5. **API Design**:
   - **Rationale**: RESTful principles with clear resource naming and appropriate HTTP methods.
   - **Benefit**: Intuitive API that's easy to understand and consume.

### API Gateway Decisions

1. **NestJS for API Gateway**:
   - **Rationale**: Provides a robust framework with built-in support for microservices.
   - **Benefit**: Strong typing with TypeScript and modular architecture for maintainability.

2. **Redis Caching Implementation**:
   - **Rationale**: Added Redis as an optional but performance-enhancing component for caching frequent geospatial calculations.
   - **Benefit**: Significantly reduces processing time for repeated operations, improving API response times and reducing computational load.
   - **Implementation**: Coordinates are hashed to create unique cache keys, with cache invalidation strategies for data freshness.
   - **Persistence**: Redis runs as a dedicated container with volume mapping to ensure cache persistence even when containers are restarted.

3. **Secure Request Proxying**:
   - **Rationale**: API Gateway forwards requests to the appropriate service while enforcing access controls.
   - **Benefit**: Clients need only interact with a single endpoint, simplifying the architecture.
   - **Security Layer**: The Gateway acts as a security boundary, controlling all access to backend services which are otherwise inaccessible from the public network.

## Running the Application

### Prerequisites

- Docker and Docker Compose
- Git

### Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/glondonot/Geo-processor.git
   cd Geo-processor
   ```

2. Start the application using Docker Compose (includes Redis cache and network segmentation):
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:3001

## API Documentation

### Backend API Endpoints

#### `POST /api/v1/process`: Process geographic coordinates

**Validaciones y restricciones implementadas:**

1. **Validación geográfica estricta:**
   - Latitud restringida al rango `-90.0` a `90.0`
   - Longitud restringida al rango `-180.0` a `180.0`
   - Validación automática mediante Pydantic con mensajes de error claros

2. **Validación estructural:**
   - Requerimiento mínimo de puntos (`min_items=2`) para garantizar operaciones válidas
   - Validación de tipos para asegurar que las coordenadas sean numéricas
   - Validación automática de la estructura JSON entrante

3. **Documentación integrada:**
   - Descripciones explícitas en cada campo para facilitar el uso de la API
   - Ejemplos incluidos en la definición del esquema
   - Documentación automática OpenAPI con Swagger

**Manejo de errores específicos:**

| Código | Tipo de Error | Descripción | Validación Implementada |
|--------|---------------|-------------|-------------------------|
| 400 | Bad Request | Error de validación de coordenadas | Verificación de rangos geográficos válidos |
| 400 | Bad Request | Puntos insuficientes | Validación de mínimo 2 puntos para operaciones |
| 422 | Unprocessable Entity | Formato de entrada inválido | Validación estructural del JSON y tipos de datos |
| 500 | Internal Server Error | Error en procesamiento | Manejo de excepciones durante cálculos geoespaciales |

### API Gateway Endpoints

#### `POST /api/process`: Punto de entrada principal para procesamiento

**Validaciones implementadas:**

1. **Validación de tipos en tiempo de ejecución:**
   - Uso de decoradores `@IsNumber()` para garantizar que las coordenadas sean numéricas
   - Validación anidada con `@ValidateNested()` para validar cada punto en el array
   - Uso de `@IsArray()` para asegurar que se envía un arreglo de puntos

2. **Manejo robusto de errores:**
   - Detección de errores en el cache de Redis con recuperación automática
   - Transformación de errores del backend para proporcionar mensajes claros al cliente
   - Uso de códigos HTTP apropiados según el tipo de error

3. **Gestión resiliente de servicios externos:**
   - Detección automática de la disponibilidad de Redis
   - Continuidad de operación cuando Redis no está disponible
   - Manejo específico de errores según el servicio que falla


**Estrategias de validación y manejo de errores:**

1. **Validación frontend:**
   - Validación reactiva de coordenadas antes del envío
   - Validación de formularios con React Hook Form
   - Mensajes de error contextuales y específicos por campo
   - Validación de mínimo 2 puntos antes de habilitar procesamiento

2. **Capas de seguridad Gateway:**
   - Interceptación y normalización de errores del backend
   - Transformación de errores técnicos en mensajes amigables
   - Reintentos automáticos para errores transitorios
   - Degradación elegante cuando servicios externos no están disponibles

3. **Gestión centralizada de errores:**
   - Registro (logging) consistente en todos los componentes
   - Auditoría completa de operaciones y errores
   - Manejo de timeout y reconexión automática

**Tabla de manejo de errores en API Gateway:**

| Código | Tipo de Error | Validación Implementada | Experiencia de Usuario |
|--------|---------------|-------------------------|------------------------|
| 400 | Bad Request | Validación de campos y estructura | Mensaje específico indicando qué campo debe corregirse |
| 404 | Not Found | Verificación de rutas y servicios | Redirección a página principal con mensaje informativo |
| 408 | Request Timeout | Límites de tiempo configurables | Opción de reintento automático o manual |
| 500 | Internal Server Error | Captura de excepciones no manejadas | Mensaje genérico con ID de error para seguimiento |
| 502 | Bad Gateway | Monitoreo de disponibilidad de servicios | Notificación al usuario sobre problemas temporales |
| 504 | Gateway Timeout | Timeouts escalonados | Sugerencia para intentar más tarde |

## Testing y Validación

### Estrategias de pruebas implementadas

1. **Pruebas unitarias**:
   - Validación de funciones de cálculo geoespacial
   - Verificación de límites y casos extremos de coordenadas
   - Pruebas de validadores de entrada con casos válidos e inválidos

2. **Pruebas de integración**:
   - Validación end-to-end del flujo de procesamiento
   - Pruebas de caché con Redis
   - Pruebas de resiliencia ante fallos de servicios

3. **Pruebas de validación frontend**:
   - Validación de formularios y manejo de errores UI
   - Pruebas de interacción usuario (agregar/eliminar puntos)
   - Verificación de la validación de mínimo 2 puntos para procesar


### Ejecución de pruebas

1. **Backend Tests**:
   ```bash
   cd services/backend
   pytest
   ```

2. **API Gateway Tests**:
   ```bash
   cd services/api-gateway
   npm run test
   ```

3. **Frontend Tests**:
   ```bash
   cd services/frontend
   npm run test
   ```

## Contact

Gabriel Londoño - [GitHub Profile](https://github.com/glondonot)

Project Link: [https://github.com/glondonot/Geo-processor](https://github.com/glondonot/Geo-processor)
