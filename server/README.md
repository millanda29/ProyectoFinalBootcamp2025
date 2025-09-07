# TravelMate API - Asistente Inteligente de Viajes

API backend para TravelMate, una plataforma web con chatbot de IA para planificación de viajes que sugiere itinerarios, calcula presupuestos y genera reportes personalizados.

## 🔧 Tecnologías Utilizadas

- **Node.js v16+** con Express.js
- **MongoDB** con Mongoose ODM
- **OpenAI API (GPT-4o-mini)** para el chatbot inteligente
- **JWT** para autenticación y autorización
- **Puppeteer** para generación de PDFs
- **Winston** para logging avanzado
- **Bcrypt** para hashing seguro de contraseñas
- **Node-cron** para tareas programadas
- **Express-list-endpoints** para documentación automática

## 📋 Funcionalidades Implementadas

### ✅ Sistema de Autenticación y Seguridad
- ✅ Registro y login de usuarios con validación
- ✅ Autenticación JWT con refresh tokens seguros
- ✅ Middleware de autorización basado en roles
- ✅ Hashing de contraseñas con salt rounds
- ✅ Protección CORS configurada
- ✅ Manejo centralizado de errores

### ✅ Gestión Avanzada de Usuarios
- ✅ Panel de administración completo (CRUD usuarios)
- ✅ Roles de usuario (admin/traveler) con permisos diferenciados
- ✅ **Eliminación lógica** con campos isDeleted, deletedAt, deletedBy
- ✅ Restauración de usuarios eliminados (admin only)
- ✅ Eliminación permanente (admin only)
- ✅ Gestión de perfiles y cambio de contraseñas
- ✅ Estadísticas de usuarios del sistema

### ✅ ChatBot IA Avanzado y Gestión de Viajes
- ✅ Integración con OpenAI GPT-4o-mini
- ✅ Generación inteligente de itinerarios personalizados
- ✅ Chat interactivo con contexto de viaje persistente
- ✅ CRUD completo de trips/viajes con eliminación lógica
- ✅ Gestión de actividades categorizadas por día
- ✅ Administración de viajes eliminados (restaurar/eliminar permanente)

### ✅ Sistema de Presupuestos y Reportes
- ✅ Cálculo detallado de costos (alojamiento, transporte, actividades)
- ✅ Generación de reportes PDF con Puppeteer
- ✅ Estimaciones automáticas de presupuesto con IA
- ✅ Exportación completa de itinerarios
- ✅ Almacenamiento persistente de reportes generados

### ✅ Funciones Administrativas Avanzadas
- ✅ Panel de control administrativo completo
- ✅ Gestión de usuarios eliminados y restauración
- ✅ Eliminación permanente de datos (irreversible)
- ✅ Estadísticas del sistema en tiempo real
- ✅ Supervisión de todos los viajes del sistema

## 🛠️ Instalación y Configuración

### Prerrequisitos
```bash
- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- NPM o Yarn
- Cuenta de OpenAI con API Key
```

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de Entorno (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/travelmate
JWT_SECRET=your-super-secret-jwt-key-with-at-least-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-with-at-least-32-characters
OPENAI_API_KEY=sk-your-openai-api-key-here
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Ejecutar la aplicación
```bash
# Desarrollo con recarga automática
npm run dev

# Producción
npm start
```

## 📚 API Endpoints Completos

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/register` | Registrar nuevo usuario | ❌ |
| POST | `/login` | Iniciar sesión | ❌ |
| POST | `/refresh` | Renovar token de acceso | ❌ |
| POST | `/logout` | Cerrar sesión (invalidar refresh token) | ❌ |
| PUT | `/change-password` | Cambiar contraseña con token | ✅ |

### 👤 Usuarios (`/api/users`)

#### Endpoints de Usuario Regular
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/me` | Obtener perfil propio | ✅ |
| PUT | `/me` | Actualizar perfil propio | ✅ |
| GET | `/me/trips` | Historial de viajes propios | ✅ |
| DELETE | `/me` | Eliminar cuenta propia (lógico) | ✅ |

#### Endpoints de Administrador
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/admin/stats` | Estadísticas del sistema | Admin |
| GET | `/admin/all` | Listar todos los usuarios activos | Admin |
| POST | `/admin/create` | Crear nuevo usuario | Admin |
| GET | `/admin/:id` | Obtener usuario por ID | Admin |
| PUT | `/admin/:id` | Actualizar usuario específico | Admin |
| DELETE | `/admin/:id` | Eliminar usuario (lógico) | Admin |
| PUT | `/admin/:id/reset-password` | Resetear contraseña de usuario | Admin |
| GET | `/admin/deleted` | Listar usuarios eliminados | Admin |
| PUT | `/admin/:id/restore` | Restaurar usuario eliminado | Admin |
| DELETE | `/admin/:id/permanent` | Eliminar usuario permanentemente | Admin |

### 🧳 Viajes (`/api/trips`)

#### Endpoints de Usuario Regular
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/my` | Mis viajes activos | ✅ |
| POST | `/` | Crear nuevo viaje | ✅ |
| GET | `/:id` | Obtener viaje por ID | ✅ |
| PUT | `/:id` | Actualizar viaje | ✅ |
| DELETE | `/:id` | Eliminar viaje (lógico) | ✅ |
| PUT | `/:id/costs` | Agregar/actualizar costos | ✅ |
| PUT | `/:id/itinerary` | Actualizar itinerario | ✅ |
| POST | `/:id/report` | Generar reporte PDF | ✅ |
| GET | `/:id/reports` | Listar reportes del viaje | ✅ |

#### Endpoints de Administrador
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Todos los viajes activos del sistema | Admin |
| GET | `/deleted` | Todos los viajes eliminados | Admin |
| PUT | `/:id/restore` | Restaurar viaje eliminado | Admin |
| DELETE | `/:id/permanent` | Eliminar viaje permanentemente | Admin |

### 🤖 ChatBot IA (`/api/chat`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/itinerary` | Generar itinerario básico con IA | ✅ |
| POST | `/trip/:tripId/itinerary` | Generar itinerario para trip específico | ✅ |
| POST | `/assistant` | Chat con asistente de viajes | ✅ |

## 📊 Modelos de Datos Actualizados

### Usuario
```javascript
{
  email: String (único, requerido),
  passwordHash: String (requerido),
  fullName: String (requerido),
  avatarUrl: String,
  dateOfBirth: Date,
  location: String,
  bio: String,
  preferences: {
    currency: String (default: 'USD'),
    language: String (default: 'es'),
    notifications: Boolean (default: true)
  },
  roles: [String] (default: ['traveler']),
  isActive: Boolean (default: true),
  lastLogin: Date,
  loginAttempts: Number (default: 0),
  createdTrips: [ObjectId] (ref: Trip),
  statistics: {
    totalTrips: Number (default: 0),
    totalDaysTravel: Number (default: 0),
    totalSpent: Number (default: 0),
    countriesVisited: [String]
  },
  // Campos de eliminación lógica
  isDeleted: Boolean (default: false),
  deletedAt: Date,
  deletedBy: ObjectId (ref: User),
  timestamps: true
}
```

### Trip (Viaje)
```javascript
{
  userId: ObjectId (ref: User, requerido),
  title: String (requerido),
  destination: String (requerido),
  startDate: Date (requerido),
  endDate: Date (requerido),
  partySize: Number (default: 1),
  status: String (enum: planned/ongoing/completed, default: planned),
  description: String,
  estimatedBudget: Number,
  actualBudget: Number,
  currency: String (default: USD),
  itinerary: [DaySchema],
  costs: [CostSchema],
  aiConversations: [ConversationSchema],
  reports: [ReportSchema],
  tags: [String],
  // Campos de eliminación lógica
  isDeleted: Boolean (default: false),
  deletedAt: Date,
  deletedBy: ObjectId (ref: User),
  timestamps: true
}
```

### Esquemas Anidados

#### Day (Día del Itinerario)
```javascript
{
  dayNumber: Number (requerido),
  date: Date,
  notes: String,
  activities: [ActivitySchema]
}
```

#### Activity (Actividad)
```javascript
{
  title: String (requerido),
  description: String,
  category: String (enum: sightseeing/restaurant/transport/lodging/entertainment/other),
  startTime: String,
  endTime: String,
  location: String,
  address: String,
  cost: Number,
  currency: String,
  externalRef: String,
  rating: Number (1-5),
  notes: String
}
```

#### Cost (Costo)
```javascript
{
  type: String (enum: lodging/transport/activity/food/shopping/other),
  label: String (requerido),
  description: String,
  currency: String (default: USD),
  amount: Number (requerido),
  quantity: Number (default: 1),
  date: Date,
  category: String,
  isEstimated: Boolean (default: false)
}
```

#### Conversation (Conversación con IA)
```javascript
{
  timestamp: Date (default: Date.now),
  userMessage: String (requerido),
  aiResponse: String (requerido),
  context: String,
  tokens: Number
}
```

#### Report (Reporte)
```javascript
{
  fileName: String (requerido),
  downloadUrl: String (requerido),
  generatedAt: Date (default: Date.now),
  fileSize: Number,
  type: String (default: 'pdf')
}
```

### RefreshToken
```javascript
{
  token: String (único, requerido),
  userId: ObjectId (ref: User, requerido),
  expiresAt: Date (requerido),
  isRevoked: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

## 🔧 Ejemplos de Uso Detallados

### Registro y Autenticación
```bash
# Registro de usuario
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "Juan Pérez",
  "dateOfBirth": "1990-05-15",
  "location": "Madrid, España"
}

# Respuesta
{
  "success": true,
  "data": {
    "user": {
      "id": "674a1b2c3d4e5f6789abcdef",
      "email": "user@example.com",
      "fullName": "Juan Pérez",
      "roles": ["traveler"]
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

### Crear Viaje Completo
```bash
POST /api/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Vacaciones en París",
  "destination": "París, Francia",
  "startDate": "2024-06-15",
  "endDate": "2024-06-20",
  "partySize": 2,
  "description": "Viaje romántico por París",
  "estimatedBudget": 2500,
  "currency": "EUR",
  "tags": ["romantic", "culture", "gastronomy"]
}
```

### Generar Itinerario con IA
```bash
POST /api/chat/trip/674a1b2c3d4e5f6789abcdef/itinerary
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferences": {
    "interests": ["arte", "gastronomía", "historia"],
    "budget": "medio",
    "style": "cultural"
  }
}

# Respuesta
{
  "success": true,
  "data": {
    "itinerary": [
      {
        "dayNumber": 1,
        "date": "2024-06-15",
        "activities": [
          {
            "title": "Visita a la Torre Eiffel",
            "category": "sightseeing",
            "startTime": "09:00",
            "endTime": "11:00",
            "location": "Torre Eiffel",
            "cost": 25,
            "currency": "EUR"
          }
        ]
      }
    ]
  }
}
```

### Administración de Usuarios Eliminados
```bash
# Listar usuarios eliminados (admin only)
GET /api/users/admin/deleted
Authorization: Bearer <admin-token>

# Restaurar usuario eliminado
PUT /api/users/admin/674a1b2c3d4e5f6789abcdef/restore
Authorization: Bearer <admin-token>

# Eliminar permanentemente
DELETE /api/users/admin/674a1b2c3d4e5f6789abcdef/permanent
Authorization: Bearer <admin-token>
```

### Agregar Costos
```bash
PUT /api/trips/60f7b3b4d1a2c3e4f5g6h7i8/costs
Authorization: Bearer <token>
Content-Type: application/json

{
  "costs": [
    {
      "type": "lodging",
      "label": "Hotel Notre-Dame",
      "amount": 120,
      "quantity": 5,
      "currency": "USD"
    },
    {
      "type": "transport",
      "label": "Metro passes",
      "amount": 15,
      "quantity": 2,
      "currency": "USD"
    }
  ]
}
```

### Generar Reporte PDF
```bash
POST /api/trips/60f7b3b4d1a2c3e4f5g6h7i8/report
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "downloadUrl": "/reports/trip-60f7b3b4d1a2c3e4f5g6h7i8-1640995200000.pdf",
    "fileName": "trip-60f7b3b4d1a2c3e4f5g6h7i8-1640995200000.pdf",
    "generatedAt": "2024-01-01T10:00:00.000Z"
  },
  "message": "Reporte PDF generado exitosamente"
}
```

## 🧪 Características del ChatBot IA

### Generación Inteligente de Itinerarios
- Sugerencias personalizadas basadas en destino, fechas y preferencias
- Actividades categorizadas con horarios optimizados
- Estimación automática y detallada de costos
- Consideración de factores como clima, eventos locales y presupuesto
- Integración con datos históricos de viajes anteriores

### Chat Interactivo Avanzado
- Respuestas contextuales sobre el viaje específico
- Sugerencias de modificaciones al itinerario en tiempo real
- Consejos de viaje personalizados basados en el perfil del usuario
- Capacidad de recordar conversaciones anteriores
- Estimaciones de presupuesto dinámicas

### Funciones de IA Específicas
- Análisis de patrones de viaje del usuario
- Recomendaciones basadas en historial y preferencias
- Optimización de rutas y tiempos
- Alertas de presupuesto y gastos
- Sugerencias de actividades alternativas

## 🛡️ Sistema de Eliminación Lógica

### Funcionamiento
- **Eliminación Lógica**: Los registros no se eliminan físicamente de la base de datos
- **Campos de Control**: `isDeleted`, `deletedAt`, `deletedBy` en todos los modelos principales
- **Filtrado Automático**: Middleware de Mongoose oculta automáticamente registros eliminados
- **Trazabilidad**: Registro completo de quién y cuándo eliminó cada elemento

### Beneficios
- ✅ Recuperación de datos accidental
- ✅ Auditoría completa de eliminaciones
- ✅ Análisis histórico de datos
- ✅ Cumplimiento de regulaciones de retención de datos
- ✅ Funcionalidad de "papelera de reciclaje"

### Administración de Datos Eliminados
- **Solo Administradores** pueden ver datos eliminados
- **Restauración** de usuarios y viajes con un clic
- **Eliminación Permanente** para limpiar datos definitivamente
- **Reportes** de elementos eliminados por fecha y usuario

## 📈 Sistema de Roles y Permisos Avanzado

### Traveler (Usuario Regular)
- ✅ Gestión completa de su perfil personal
- ✅ Crear, editar y eliminar sus propios viajes
- ✅ Usar todas las funciones del chatbot IA
- ✅ Generar y descargar reportes de sus viajes
- ✅ Eliminar su propia cuenta (eliminación lógica)
- ❌ Ver datos de otros usuarios
- ❌ Funciones administrativas

### Admin (Administrador)
- ✅ **Todas las funciones de Traveler**
- ✅ Ver y gestionar todos los usuarios del sistema
- ✅ Ver y gestionar todos los viajes del sistema
- ✅ Crear usuarios directamente
- ✅ Resetear contraseñas de cualquier usuario
- ✅ Ver estadísticas completas del sistema
- ✅ **Gestionar datos eliminados** (ver, restaurar, eliminar permanente)
- ✅ Acceso a funciones de auditoría y control

## � Seguridad Implementada

### Autenticación
- **JWT con tiempos de vida cortos** (15 minutos para access token)
- **Refresh tokens seguros** con rotación automática
- **Invalidación de tokens** en logout
- **Protección contra ataques de fuerza bruta**

### Autorización
- **Middleware de roles** granular
- **Validación de propietario** para recursos personales
- **Protección de endpoints administrativos**
- **Verificación de permisos en tiempo real**

### Datos
- **Hashing de contraseñas** con bcrypt y salt rounds altos
- **Validación de entrada** en todos los endpoints
- **Sanitización de datos** antes de almacenamiento
- **Protección CORS** configurada específicamente

### Auditoría
- **Logging completo** de todas las operaciones
- **Registro de eliminaciones** con usuario y timestamp
- **Trazabilidad de cambios** en datos críticos
- **Monitoreo de intentos de acceso** fallidos

## 📁 Estructura del Proyecto Actualizada

```
server/
├── src/
│   ├── auth/                     # Sistema de autenticación
│   │   ├── authController.js     # Controlador de autenticación
│   │   ├── authMiddleware.js     # Middleware JWT y autorización
│   │   ├── authRouter.js         # Rutas de autenticación
│   │   └── authService.js        # Lógica de negocio de auth
│   ├── controllers/              # Controladores principales
│   │   ├── chatController.js     # Control del chatbot IA
│   │   ├── tripController.js     # Control de viajes
│   │   └── userController.js     # Control de usuarios
│   ├── middlewares/              # Middlewares personalizados
│   │   ├── errorHandler.js       # Manejo centralizado de errores
│   │   └── isAdmin.js            # Middleware de autorización admin
│   ├── models/                   # Modelos de MongoDB
│   │   ├── RefreshToken.js       # Modelo de refresh tokens
│   │   ├── Trip.js               # Modelo de viajes con soft delete
│   │   └── User.js               # Modelo de usuarios con soft delete
│   ├── routers/                  # Definición de rutas
│   │   ├── chatRouter.js         # Rutas del chatbot
│   │   ├── index.js              # Router principal
│   │   ├── tripRouter.js         # Rutas de viajes
│   │   └── userRouter.js         # Rutas de usuarios
│   ├── services/                 # Lógica de negocio
│   │   ├── chatService.js        # Servicios del chatbot IA
│   │   ├── reportService.js      # Generación de reportes PDF
│   │   ├── tripService.js        # Servicios de viajes
│   │   └── userService.js        # Servicios de usuarios
│   ├── tasks/                    # Tareas programadas
│   │   └── scheduledDeletions.js # Limpieza automática de datos
│   ├── utils/                    # Utilidades
│   │   ├── generateToken.js      # Generación de tokens JWT
│   │   ├── hashPassword.js       # Hashing de contraseñas
│   │   └── logger.js             # Configuración de Winston
│   ├── app.js                    # Configuración de Express
│   └── seed.js                   # Datos de prueba y inicialización
├── reports/                      # PDFs generados (persistentes)
├── api-endpoints.json            # Documentación completa de API
├── ENDPOINTS-SUMMARY.md          # Resumen de endpoints
├── index.js                      # Punto de entrada principal
├── package.json                  # Dependencias y scripts
└── README.md                     # Esta documentación
```

## 🚀 Estado Actual del Desarrollo

### ✅ Completado (100%)
- [x] **Sistema de autenticación JWT completo** con refresh tokens
- [x] **Gestión avanzada de usuarios** con roles y permisos
- [x] **Eliminación lógica** implementada en todos los modelos
- [x] **Panel de administración** completo con gestión de eliminados
- [x] **ChatBot IA integrado** con OpenAI GPT-4o-mini
- [x] **CRUD completo de viajes** con funciones avanzadas
- [x] **Sistema de costos y presupuestos** detallado
- [x] **Generación de reportes PDF** con Puppeteer
- [x] **API RESTful** completamente documentada
- [x] **Logging y manejo de errores** centralizado
- [x] **Seguridad avanzada** con validaciones y protecciones

### 🎯 Criterios de Aceptación Cumplidos
- ✅ El sistema genera itinerarios IA en menos de 5 segundos
- ✅ El ChatBot responde con contexto en tiempo real
- ✅ Los reportes se generan y almacenan correctamente
- ✅ Arquitectura MERN Stack completamente implementada
- ✅ Roles y permisos funcionando correctamente
- ✅ Eliminación lógica funcional con administración completa
- ✅ Todas las validaciones de seguridad implementadas
- ✅ API completamente documentada y coherente

## � Estadísticas del Proyecto

### Dependencias
```json
{
  "dependencies": {
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.2",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^4.21.2",
    "express-list-endpoints": "^7.1.1",
    "html2canvas": "^1.4.1",
    "jsonwebtoken": "^9.0.2",
    "jspdf": "^3.0.2",
    "mongoose": "^8.18.0",
    "morgan": "^1.10.1",
    "node-cron": "^4.2.1",
    "openai": "^5.19.1",
    "puppeteer": "^24.19.0",
    "winston": "^3.17.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Endpoints Totales
- **Autenticación**: 5 endpoints
- **Usuarios**: 12 endpoints (6 regulares + 6 admin)
- **Viajes**: 12 endpoints (8 regulares + 4 admin)
- **ChatBot**: 3 endpoints
- **Total**: 32 endpoints funcionales

## 🔄 Scripts NPM

```json
{
  "start": "node index.js",      // Producción
  "dev": "nodemon index.js"      // Desarrollo con recarga automática
}
```

### Comandos de Ejecución

```bash
# Instalar dependencias
npm install

# Desarrollo (recomendado)
npm run dev

# Producción
npm start
```

## 🌐 Configuración de Producción

### Variables de Entorno Requeridas
```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/travelmate
JWT_SECRET=super-secret-key-min-32-characters-for-production
JWT_REFRESH_SECRET=another-super-secret-key-min-32-characters
OPENAI_API_KEY=sk-your-production-openai-key
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production
```

### Consideraciones de Deployment
- **MongoDB Atlas** recomendado para producción
- **Heroku, Railway, o AWS** para hosting del backend
- **Variables de entorno** configuradas en el servicio de hosting
- **CORS** configurado para el dominio del frontend
- **HTTPS** obligatorio en producción

## 👥 Equipo de Desarrollo

- **Backend Developer**: API Node.js, integración IA, bases de datos
- **Frontend Developer**: Interfaz React, integración con API
- **Product Owner**: Requerimientos, visión del producto, priorización
- **Scrum Master / QA**: Metodología ágil, testing, calidad del software

---

## 📖 Documentación general

* Para detalles de la instalación y ejecución completa del proyecto, revisa el [README principal](../README.md).
* Para detalles del **frontend**, revisa el [README del client](../client/README.md).

---

## 📞 Soporte y Documentación

- **API Documentation**: `api-endpoints.json` (completa y actualizada)
- **Endpoints Summary**: `ENDPOINTS-SUMMARY.md`
- **Logs**: Archivos `combined.log` y `error.log` con Winston
- **Code Structure**: Arquitectura modular y bien documentada

---

**TravelMate API v1.0** - Desarrollado con ❤️ usando Node.js, MongoDB y OpenAI



