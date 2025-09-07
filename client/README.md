# 🧳 TravelMate Client

## 🌟 Descripción del Proyecto

TravelMate es una aplicación web moderna de planificación de viajes que utiliza inteligencia artificial para generar itinerarios personalizados. La aplicación permite a los usuarios crear, gestionar y compartir sus planes de viaje con una interfaz intuitiva y funcionalidades avanzadas.

### ✨ Características Principales

- **🤖 Asistente de IA**: Chat inteligente para planificación de viajes personalizada
- **🗺️ Gestión de Itinerarios**: Creación y edición de itinerarios detallados
- **📊 Dashboard Administrativo**: Panel completo para gestión de usuarios y estadísticas
- **📱 Diseño Responsivo**: Interfaz optimizada para todos los dispositivos
- **🔐 Autenticación Segura**: Sistema completo de login/registro con JWT
- **📄 Reportes PDF**: Generación automática de reportes de viaje
- **� Control de Presupuesto**: Gestión de costos y gastos de viaje

## 🏗️ Arquitectura del Proyecto

```
client/
├── public/                     # Assets públicos
│   ├── logo-icon.png          # Logo de la aplicación
│   ├── diverse-user-avatars.png # Avatares de usuarios
│   └── ...                    # Imágenes de destinos
├── src/
│   ├── components/            # Componentes React reutilizables
│   │   ├── ui/               # Componentes UI base (buttons, cards, etc.)
│   │   ├── Layout.jsx        # Layout principal de la aplicación
│   │   ├── ProtectedRoute.jsx # Rutas protegidas
│   │   ├── ChatWidget.jsx    # Widget de chat con IA
│   │   └── ...               # Otros componentes
│   ├── pages/                # Páginas principales
│   │   ├── Home.jsx          # Página de inicio
│   │   ├── Dashboard.jsx     # Dashboard del usuario
│   │   ├── Admin.jsx         # Panel de administración
│   │   ├── Chat.jsx          # Chat con IA
│   │   ├── Login.jsx         # Página de login
│   │   ├── Register.jsx      # Página de registro
│   │   ├── Profile.jsx       # Perfil de usuario
│   │   ├── Itineraries.jsx   # Lista de itinerarios
│   │   ├── ItineraryGenerator.jsx # Generador de itinerarios
│   │   └── TripDetails.jsx   # Detalles de viaje
│   ├── context/              # Context API para estado global
│   │   ├── AuthContext.jsx   # Contexto de autenticación
│   │   └── AuthProvider.jsx  # Proveedor de autenticación
│   ├── data/                 # Cliente API y utilidades
│   │   ├── api.js           # API principal con interceptores
│   │   ├── apiAuth.js       # Endpoints de autenticación
│   │   ├── apiUsers.js      # Endpoints de usuarios
│   │   ├── apiTrips.js      # Endpoints de viajes
│   │   ├── apiChat.js       # Endpoints de chat con IA
│   │   ├── apiUtils.js      # Utilidades y helpers
│   │   ├── apiTypes.js      # Tipos y constantes
│   │   └── countries.js     # Datos de países
│   ├── lib/                 # Librerías y utilidades
│   │   └── utils.js         # Funciones utilitarias
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── package.json             # Dependencias y scripts
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
├── eslint.config.js        # Configuración de ESLint
└── README.md               # Este archivo
```

## � Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca principal de UI
- **Vite** - Build tool y servidor de desarrollo
- **React Router DOM** - Enrutamiento del lado cliente
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Íconos modernos
- **Class Variance Authority** - Gestión de variantes de componentes

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 🔧 Instalación y Configuración

### Prerrequisitos
- **Node.js** 18.0 o superior
- **npm** o **yarn**
- Servidor backend de TravelMate ejecutándose

### 1. Clonar el Repositorio
```bash
git clone [repository-url]
cd client
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:4000
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### 5. Build para Producción
```bash
npm run build
npm run preview
```

## 📋 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | Ejecuta ESLint para revisar código |

## 🎯 Funcionalidades Principales

### 👤 Gestión de Usuarios
- **Registro e Inicio de Sesión** - Sistema completo de autenticación
- **Perfil de Usuario** - Gestión de información personal y preferencias
- **Preferencias de Viaje** - Configuración de estilos de viaje personalizados
- **Configuración de Notificaciones** - Control de notificaciones de la aplicación

### 🗺️ Planificación de Viajes
- **Creación de Itinerarios** - Herramientas para planificar viajes detallados
- **Asistente de IA** - Chat inteligente para recomendaciones personalizadas
- **Gestión de Presupuesto** - Control de costos y gastos
- **Estados de Viaje** - Seguimiento del progreso (planificado, activo, completado)

### 📊 Panel de Administración
- **Estadísticas del Sistema** - Métricas de usuarios y viajes
- **Gestión de Usuarios** - Activar/desactivar cuentas de usuario
- **Gestión de Viajes** - Supervisión y administración de viajes
- **Configuración del Sistema** - Ajustes generales de la aplicación

### 🤖 Inteligencia Artificial
- **Chat Asistente** - Conversación natural para planificación
- **Generación de Itinerarios** - Creación automática basada en preferencias
- **Recomendaciones Personalizadas** - Sugerencias adaptadas al usuario

## 🔐 Sistema de Autenticación

### Características
- **JWT Tokens** - Autenticación segura con tokens
- **Refresh Tokens** - Renovación automática de sesiones
- **Rutas Protegidas** - Control de acceso basado en roles
- **Interceptores Automáticos** - Manejo transparente de tokens

### Roles de Usuario
- **User** - Usuario estándar con acceso a funciones básicas
- **Admin** - Administrador con acceso completo al sistema

## 📡 Cliente API

### Estructura Modular
```javascript
// Ejemplo de uso
import { authAPI, usersAPI, tripsAPI, chatAPI } from './data/api.js'

// Autenticación
await authAPI.login(credentials)
await authAPI.logout(token, refreshToken)

// Gestión de usuarios
await usersAPI.getProfile(token)
await usersAPI.admin.getAllUsers(token)

// Gestión de viajes
await tripsAPI.createTrip(token, tripData)
await tripsAPI.generatePdfReport(token, tripId)

// Chat con IA
await chatAPI.chatAssistant(token, chatData)
```

### Características del Cliente API
- **Interceptores Automáticos** - Manejo de tokens y errores
- **Refresh Automático** - Renovación transparente de tokens
- **Validación de Datos** - Validación antes del envío
- **Manejo de Errores** - Gestión centralizada de errores
- **Utilidades** - Funciones helper para formatos y validaciones

## 🎨 Componentes UI

### Sistema de Diseño
- **Componentes Reutilizables** - UI consistente en toda la app
- **Variantes Dinámicas** - Estilos adaptativos con CVA
- **Tema Consistente** - Paleta de colores y tipografía unificada
- **Responsive Design** - Adaptable a todos los tamaños de pantalla

### Componentes Principales
- **Button** - Botones con múltiples variantes
- **Card** - Contenedores de contenido
- **Input** - Campos de entrada con validación
- **Badge** - Etiquetas de estado
- **Avatar** - Imágenes de perfil
- **Tabs** - Navegación por pestañas

## 🌐 Enrutamiento

### Rutas Públicas
- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro de usuario

### Rutas Protegidas
- `/dashboard` - Dashboard principal
- `/profile` - Perfil de usuario
- `/itineraries` - Lista de itinerarios
- `/chat` - Chat con IA
- `/trip/:id` - Detalles de viaje

### Rutas de Administrador
- `/admin` - Panel de administración (solo admins)

## 🚨 Manejo de Errores

### Estrategias Implementadas
- **Boundary Components** - Captura de errores en componentes
- **API Error Handling** - Gestión centralizada de errores de API
- **User Feedback** - Notificaciones informativas al usuario
- **Fallbacks** - Interfaces de respaldo en caso de error

## � Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL del servidor backend | `http://localhost:4000` |

## 📚 Documentación Adicional

- **API Endpoints** - `api-endpoints.json` - Especificación completa de la API
- **Implementación Final** - `IMPLEMENTACION_FINAL_ENDPOINTS.md` - Detalles de implementación
- **API Client** - `src/data/README.md` - Documentación del cliente API

## 🤝 Contribución

### Proceso de Desarrollo
1. Fork del repositorio
2. Crear rama para nueva feature (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commit de cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- **ESLint** - Seguir las reglas configuradas
- **Prettier** - Formateo consistente de código
- **Conventional Commits** - Formato estándar para commits
- **Component Structure** - Estructura consistente de componentes

## 📈 Performance

### Optimizaciones Implementadas
- **Code Splitting** - Carga bajo demanda de componentes
- **Lazy Loading** - Carga diferida de rutas
- **Memoization** - Optimización de re-renders
- **Bundle Optimization** - Optimización del bundle con Vite

## 🔒 Seguridad

### Medidas Implementadas
- **XSS Protection** - Sanitización de inputs
- **CSRF Protection** - Tokens de protección CSRF
- **Secure Headers** - Headers de seguridad HTTP
- **Input Validation** - Validación exhaustiva de datos

## 📱 Responsividad

### Breakpoints
- **Mobile** - < 768px
- **Tablet** - 768px - 1024px
- **Desktop** - > 1024px
- **Large Desktop** - > 1440px

## 🚀 Deploy

### Opciones de Deploy
- **Vercel** - Deploy automático desde Git
- **Netlify** - Deploy con CI/CD
- **GitHub Pages** - Deploy estático
- **Docker** - Containerización para cualquier plataforma

---

## 📖 Documentación general

* Para detalles de la instalación y ejecución completa del proyecto, revisa el [README principal](../README.md).
* Para detalles del **backend**, revisa el [README del server](../server/README.md).

---

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, crear un issue en el repositorio o contactar al equipo de desarrollo.

**Versión**: 1.0.0  
**Última actualización**: Septiembre 2025