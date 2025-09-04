# TravelMate API - Asistente Inteligente de Viajes

API backend para TravelMate, una plataforma web con chatbot de IA para planificación de viajes que sugiere itinerarios, calcula presupuestos y genera reportes personalizados.

## � Tecnologías Utilizadas

- **Node.js** con Express.js
- **MongoDB** con Mongoose
- **OpenAI API** para el chatbot inteligente
- **JWT** para autenticación
- **Puppeteer** para generación de PDFs
- **Winston** para logging
- **Bcrypt** para hashing de contraseñas

## 📋 Funcionalidades Implementadas

### ✅ Sprint 1 & 2: Autenticación y Gestión de Usuarios
- ✅ Registro y login de usuarios
- ✅ Autenticación JWT con refresh tokens
- ✅ Gestión de perfiles de usuario
- ✅ Panel de administración completo (CRUD usuarios)
- ✅ Roles de usuario (admin/traveler)
- ✅ Historial de viajes por usuario

### ✅ Sprint 3: ChatBot IA y Gestión de Viajes
- ✅ Integración con OpenAI para generación de itinerarios
- ✅ Chat interactivo con contexto de viaje
- ✅ CRUD completo de trips/viajes
- ✅ Generación automática de itinerarios con IA
- ✅ Gestión de actividades por día

### ✅ Sprint 4: Presupuestos y Reportes
- ✅ Sistema de cálculo de costos (alojamiento, transporte, actividades)
- ✅ Generación de reportes PDF descargables
- ✅ Estimaciones de presupuesto con IA
- ✅ Exportación de itinerarios completos

## 🛠️ Instalación y Configuración

### Prerrequisitos
```bash
- Node.js (v16 o superior)
- MongoDB
- NPM o Yarn
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
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Ejecutar la aplicación
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/register` | Registrar nuevo usuario | ❌ |
| POST | `/login` | Iniciar sesión | ❌ |
| POST | `/refresh` | Renovar token | ❌ |
| POST | `/logout` | Cerrar sesión | ❌ |

### 👤 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/me` | Obtener perfil propio | ✅ |
| PUT | `/me` | Actualizar perfil propio | ✅ |
| GET | `/me/trips` | Historial de viajes | ✅ |
| PUT | `/me/change-password` | Cambiar contraseña | ✅ |

#### Admin Only
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/admin/stats` | Estadísticas del sistema | Admin |
| GET | `/admin/all` | Listar todos los usuarios | Admin |
| POST | `/admin/create` | Crear usuario | Admin |
| GET | `/admin/:id` | Obtener usuario por ID | Admin |
| PUT | `/admin/:id` | Actualizar usuario | Admin |
| DELETE | `/admin/:id` | Eliminar usuario | Admin |
| PUT | `/admin/:id/reset-password` | Resetear contraseña | Admin |

### 🧳 Viajes (`/api/trips`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/my` | Mis viajes | ✅ |
| POST | `/` | Crear viaje | ✅ |
| GET | `/:id` | Obtener viaje por ID | ✅ |
| PUT | `/:id` | Actualizar viaje | ✅ |
| DELETE | `/:id` | Eliminar viaje | ✅ |
| PUT | `/:id/costs` | Agregar costos | ✅ |
| PUT | `/:id/itinerary` | Actualizar itinerario | ✅ |
| POST | `/:id/report` | Generar reporte PDF | ✅ |
| GET | `/:id/reports` | Listar reportes | ✅ |

#### Admin Only
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Todos los viajes | Admin |

### 🤖 ChatBot IA (`/api/chat`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/itinerary` | Generar itinerario básico | ✅ |
| POST | `/trip/:tripId/itinerary` | Generar itinerario para trip | ✅ |
| POST | `/assistant` | Chat con asistente | ✅ |

## 📊 Modelos de Datos

### Usuario
```javascript
{
  email: String (único, requerido),
  passwordHash: String (requerido),
  fullName: String (requerido),
  avatarUrl: String,
  roles: [String] (default: ['traveler']),
  isActive: Boolean (default: true),
  lastLogin: Date,
  loginAttempts: Number,
  createdTrips: [ObjectId] (ref: Trip),
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
  status: String (enum: planned/ongoing/completed),
  itinerary: [DaySchema],
  costs: [CostSchema],
  aiConversations: [ConversationSchema],
  reports: [ReportSchema],
  timestamps: true
}
```

### Esquemas Anidados

#### Day (Día del Itinerario)
```javascript
{
  dayNumber: Number (requerido),
  notes: String,
  activities: [ActivitySchema]
}
```

#### Activity (Actividad)
```javascript
{
  title: String (requerido),
  category: String,
  startTime: String,
  endTime: String,
  location: String,
  externalRef: String
}
```

#### Cost (Costo)
```javascript
{
  type: String (enum: lodging/transport/activity/other),
  label: String (requerido),
  currency: String (default: USD),
  amount: Number (requerido),
  quantity: Number (default: 1)
}
```

## 🔧 Ejemplos de Uso

### Registro de Usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "Juan Pérez"
}
```

### Crear Viaje
```bash
POST /api/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Vacaciones en París",
  "destination": "París, Francia",
  "startDate": "2024-06-15",
  "endDate": "2024-06-20",
  "partySize": 2
}
```

### Generar Itinerario con IA
```bash
POST /api/chat/trip/60f7b3b4d1a2c3e4f5g6h7i8/itinerary
Authorization: Bearer <token>
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

### Generación de Itinerarios
- Sugerencias personalizadas basadas en destino y fechas
- Actividades categorizadas por tipo
- Horarios sugeridos para cada actividad
- Estimación automática de costos

### Chat Interactivo
- Respuestas contextuales sobre el viaje
- Sugerencias de modificaciones al itinerario
- Consejos de viaje personalizados
- Integración con datos del trip existente

## 📈 Sistema de Roles y Permisos

### Traveler (Usuario Regular)
- ✅ Gestionar su propio perfil
- ✅ Crear y administrar sus viajes
- ✅ Usar el chatbot IA
- ✅ Generar reportes de sus viajes
- ❌ Ver otros usuarios o viajes

### Admin (Administrador)
- ✅ Todas las funciones de Traveler
- ✅ Ver todos los usuarios y viajes
- ✅ Crear, editar y eliminar usuarios
- ✅ Resetear contraseñas
- ✅ Ver estadísticas del sistema

## 🛡️ Seguridad

- Autenticación JWT con tokens de corta duración
- Refresh tokens para renovación segura
- Hashing de contraseñas con bcrypt
- Validación de entrada en todos los endpoints
- Autorización basada en roles
- Protección CORS configurada

## 📁 Estructura del Proyecto

```
server/
├── src/
│   ├── auth/                 # Autenticación
│   │   ├── authController.js
│   │   ├── authMiddleware.js
│   │   ├── authRouter.js
│   │   └── authService.js
│   ├── controllers/          # Controladores
│   │   ├── chatController.js
│   │   ├── tripController.js
│   │   └── userController.js
│   ├── middlewares/          # Middlewares
│   │   ├── errorHandler.js
│   │   └── isAdmin.js
│   ├── models/              # Modelos de MongoDB
│   │   ├── RefreshToken.js
│   │   ├── Trip.js
│   │   └── User.js
│   ├── routers/             # Rutas
│   │   ├── chatRouter.js
│   │   ├── index.js
│   │   ├── tripRouter.js
│   │   └── userRouter.js
│   ├── services/            # Servicios
│   │   ├── chatService.js
│   │   ├── reportService.js
│   │   ├── tripService.js
│   │   └── userService.js
│   ├── utils/               # Utilidades
│   │   ├── generateToken.js
│   │   ├── hashPassword.js
│   │   └── logger.js
│   ├── app.js              # Configuración de Express
│   └── seed.js             # Datos de prueba
├── reports/                 # PDFs generados
├── index.js                # Punto de entrada
├── package.json
└── README.md
```

## 🚀 Estado del Desarrollo

### ✅ Completado (100%)
- [x] Sistema de autenticación completo
- [x] Gestión de usuarios y admin panel
- [x] ChatBot IA con OpenAI
- [x] CRUD completo de viajes
- [x] Sistema de costos y presupuestos
- [x] Generación de reportes PDF
- [x] API RESTful completa
- [x] Documentación de endpoints

### 🎯 Criterios de Aceptación Cumplidos
- ✅ El sistema genera itinerarios en menos de 5 segundos
- ✅ El ChatBot responde en tiempo real
- ✅ Los reportes se guardan en la cuenta del usuario
- ✅ Arquitectura MERN Stack implementada
- ✅ Roles diferenciados funcionando
- ✅ Validaciones de seguridad implementadas

## 🔄 Próximos Pasos (Opcionales)
- [ ] Integración con APIs de mapas
- [ ] Notificaciones push
- [ ] Cache con Redis
- [ ] Tests unitarios y de integración
- [ ] Deployment en AWS/Heroku
- [ ] Métricas y monitoreo

## 👥 Equipo de Desarrollo
- **Backend Developer**: Encargado del servidor Node.js, APIs e integración con IA
- **Product Owner**: Definición de requerimientos y visión del proyecto
- **Scrum Master / QA**: Metodología ágil, pruebas y calidad del software
- **Frontend Developer**: Interfaz web en React (repositorio separado)

---

**TravelMate API v1.0** - Desarrollado con ❤️ usando Node.js y OpenAI

---

## 🛠️ Tecnologías

- 🟢 **Node.js** – Entorno de ejecución en servidor  
- 🚂 **Express.js** – Framework para APIs REST  
- 🍃 **MongoDB / Mongoose** – Base de datos y modelado de datos  
- 🌐 **MongoDB Atlas** – Base de datos en la nube  
- 🤖 **OpenAI API** – ChatBot inteligente y generación de itinerarios  

---

## 🌟 Características

- Autenticación y autorización de usuarios con roles  
- Gestión de usuarios e itinerarios (CRUD)  
- ChatBot de IA integrado para planificación de viajes  
- Cálculo de presupuesto y generación de reportes PDF  
- Middleware de validación y manejo de errores  

---

## 📂 Estructura principal

```

server/
├── src/
│   ├── auth/          # Autenticación (controller, service, router, middleware)
│   ├── controllers/   # Controladores principales
│   ├── services/      # Lógica de negocio
│   ├── models/        # Modelos de datos
│   ├── routers/       # Rutas del backend
│   ├── middlewares/   # Middlewares personalizados
│   ├── utils/         # Utilidades (logger, hashing, token)
│   ├── app.js         # Configuración principal de Express
│   └── seed.js        # Datos de ejemplo / inicialización
├── package.json        # Dependencias y scripts
├── .env                # Variables de entorno
└── README.md           # Este documento

````

---

## 🏷️ Scripts del `package.json`

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
````

### Explicación de cada script

1. **`start`** – 🚀 Iniciar servidor en producción

   ```bash
   npm start
   ```

   * Ejecuta el backend usando **Node.js**.
   * Se usa para desplegar la app en producción.

2. **`dev`** – ⚡ Modo desarrollo con recarga automática

   ```bash
   npm run dev
   ```

   * Ejecuta el servidor con **nodemon**, reiniciando automáticamente al detectar cambios en el código.
   * Ideal para desarrollo y pruebas locales.

---

## 📖 Documentación general

* Para detalles de la instalación y ejecución completa del proyecto, revisa el [README principal](../README.md).
* Para detalles del **frontend**, revisa el [README del client](../client/README.md).

---

> Este README sirve como guía rápida del backend, referencia de su estructura, tecnologías y scripts. ✨

