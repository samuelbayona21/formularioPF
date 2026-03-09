# Backend - Clean Architecture

API REST construida con **Clean Architecture** en Node.js + Express + MySQL

## 🏗️ Arquitectura

```
backend/
├── src/
│   ├── domain/              # Capa de Dominio
│   │   ├── entities/        # Entidades con reglas de negocio
│   │   ├── repositories/    # Interfaces (contratos)
│   │   └── use-cases/       # Casos de uso (lógica de negocio)
│   │
│   ├── application/         # Capa de Aplicación
│   │   ├── dtos/            # Data Transfer Objects
│   │   └── mappers/         # Transformadores de datos
│   │
│   ├── infrastructure/      # Capa de Infraestructura
│   │   ├── database/        # Conexión a BD
│   │   ├── repositories/    # Implementaciones de repositorios
│   │   └── config/          # Configuración (DI Container)
│   │
│   └── presentation/        # Capa de Presentación
│       ├── controllers/     # Controladores HTTP
│       ├── middleware/      # Middleware (Auth, CORS)
│       ├── routes/          # Definición de rutas
│       └── validators/      # Validadores de entrada
│
└── server.js                # Punto de entrada
```

## 📚 Principios de Clean Architecture

### 1. Independencia de Frameworks
- El dominio no depende de Express, MySQL ni ningún framework
- Puedes cambiar Express por Fastify sin tocar el dominio

### 2. Testeable
- La lógica de negocio está en Use Cases
- Puedes testear sin BD ni HTTP

### 3. Independencia de la UI
- El backend no sabe si el frontend es React, Vue o mobile

### 4. Independencia de la BD
- Puedes cambiar MySQL por PostgreSQL o MongoDB
- Solo cambias la capa de Infrastructure

### 5. Reglas de Dependencia
```
Presentation → Application → Domain
Infrastructure → Domain

Domain NO depende de nadie
```

## 🚀 Instalación

```bash
npm install
cp .env.example .env
# Editar .env con credenciales
```

## ▶️ Ejecutar

```bash
npm run dev
```

## 🔌 Endpoints

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/examen/preguntas` - Obtener preguntas
- `POST /api/examen/respuesta` - Guardar respuesta
- `GET /api/examen/tiempo` - Obtener tiempo
- `POST /api/examen/tiempo` - Guardar tiempo
- `POST /api/examen/finalizar` - Finalizar examen

## 🎯 Flujo de una Petición

```
1. HTTP Request → Controller (Presentation)
2. Controller → DTO (Application)
3. DTO valida datos
4. Controller → Use Case (Domain)
5. Use Case → Repository Interface (Domain)
6. Repository Implementation (Infrastructure) → Database
7. Database → Repository → Use Case
8. Use Case → Mapper (Application)
9. Mapper → DTO → Controller
10. Controller → HTTP Response
```

## 📦 Capas Explicadas

### Domain (Dominio)
- **Entities:** Objetos con identidad y reglas de negocio
- **Use Cases:** Lógica de aplicación (iniciar examen, guardar respuesta)
- **Repository Interfaces:** Contratos que debe cumplir la infraestructura

### Application (Aplicación)
- **DTOs:** Objetos para transferir datos entre capas
- **Mappers:** Transforman entre entidades y DTOs

### Infrastructure (Infraestructura)
- **Database:** Conexión a MySQL
- **Repositories:** Implementación de las interfaces del dominio
- **Config:** Dependency Injection Container

### Presentation (Presentación)
- **Controllers:** Reciben HTTP, llaman Use Cases, devuelven respuestas
- **Middleware:** Autenticación, CORS, validación
- **Routes:** Mapeo de URLs a controladores

## 🔧 Dependency Injection

El `container.js` configura todas las dependencias:

```javascript
// Repositories
usuarioRepository = new MySQLUsuarioRepository()

// Use Cases
iniciarExamenUseCase = new IniciarExamenUseCase(
    usuarioRepository,
    examenRepository
)

// Controllers
examenController = new ExamenController(
    iniciarExamenUseCase,
    ...
)
```

## ✅ Ventajas

1. **Testeable:** Puedes mockear repositorios y testear use cases
2. **Mantenible:** Cada capa tiene una responsabilidad clara
3. **Escalable:** Fácil agregar nuevas features
4. **Flexible:** Cambiar tecnologías sin afectar el dominio
5. **SOLID:** Cumple todos los principios SOLID

## 🧪 Testing (Futuro)

```javascript
// Test de Use Case (sin BD)
const mockRepo = {
    findByCedula: jest.fn().mockResolvedValue(null)
};

const useCase = new IniciarExamenUseCase(mockRepo, mockExamenRepo);
const result = await useCase.execute('Juan', '123456');
```

## 📖 Recursos

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
