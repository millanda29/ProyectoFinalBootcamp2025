# 🌍 TravelMate – Asistente Inteligente de Viajes

![TravelMate Banner](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=250)

**Desarrollado por:** 

- [Vladimir Castillo](https://github.com/vladimirmcy2005)
- [Christian Iza](https://github.com/ciizao)
- [Maikol Llanda](https://github.com/millanda29)
- [Alex Ramirez](https://github.com/ALISrj)

**Módulo:** Módulo IV - DevOps  
**Bootcamp de Programación 2025**

## 📝 Descripción General

TravelMate es una aplicación web completa construida con el stack MERN que ayuda a los usuarios a planificar viajes de manera inteligente y personalizada. La aplicación utiliza inteligencia artificial (OpenAI GPT-4o-mini) para generar itinerarios personalizados, calcular presupuestos detallados y proporcionar recomendaciones de hospedaje, transporte y actividades. Los usuarios pueden chatear con un asistente de IA, gestionar sus viajes, generar reportes PDF y administrar su perfil, mientras que los administradores tienen acceso a un panel completo de gestión de usuarios y estadísticas.

## 🛠️ Tecnologías Utilizadas

### Frontend:
- **React 19.1.1** - Biblioteca principal para la interfaz de usuario
- **Vite** - Herramienta de desarrollo y build
- **React Router DOM** - Navegación y enrutamiento
- **Tailwind CSS** - Framework de CSS para estilos
- **Lucide React** - Iconografía moderna

### Backend:
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **MongoDB Atlas** - Servicio en la nube de MongoDB

### Integraciones y Servicios:
- **OpenAI API (GPT-4o-mini)** - Inteligencia artificial para chat y generación de itinerarios
- **JWT (JSON Web Tokens)** - Autenticación y autorización
- **Puppeteer** - Generación de reportes PDF
- **Winston** - Sistema de logging avanzado
- **Bcrypt** - Encriptación de contraseñas

### Plataformas de Despliegue:
- **Render** - Despliegue del backend (Web Service)
- **Vercel** - Despliegue del frontend (Static Site)

## Instrucciones para Ejecutar Localmente

### Requisitos Previos
- Node.js v16 o superior
- MongoDB (local) o cuenta de MongoDB Atlas
- Git

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/millanda29/ProyectoFinalBootcamp2025.git
cd ProyectoFinalBootcamp2025
```

### Paso 2: Configurar el Backend
```bash
cd server
npm install
```

Crea un archivo `.env` en la carpeta `server` con las siguientes variables:
```env
# Base de datos
MONGO_URI=tu_uri_de_mongodb_atlas

# Servidor
PORT=5000

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# OpenAI
OPENAI_API_KEY=tu_api_key_de_openai

# CORS
CLIENT_URL=http://localhost:5173
```

### Paso 3: Configurar el Frontend
```bash
cd ../client
npm install
```

### Paso 4: Ejecutar la Aplicación
**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

La aplicación estará disponible en:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 🚀 Proceso de Despliegue

### Estrategia de Despliegue
Dividí la aplicación en dos partes independientes para optimizar el despliegue:

**Frontend (Vercel):**
1. Configuré el build de producción:
   ```bash
   npm run build
   ```
2. Subí el proyecto a Vercel como Static Site
3. Configuré las variables de entorno necesarias
4. Conecté el repositorio de GitHub para despliegue automático

**Backend (Render):**
1. Configuré un Web Service en Render
2. Especifiqué el comando de inicio: `npm start`
3. Agregué todas las variables de entorno:
   - MONGO_URI (conexión a MongoDB Atlas)
   - JWT_SECRET y JWT_REFRESH_SECRET
   - OPENAI_API_KEY
   - CLIENT_URL (URL del frontend desplegado)
4. Conecté el repositorio para despliegue automático

### 🌐 Enlaces de la Aplicación Desplegada
- **Backend API:** [Server_Render](https://proyectofinalbootcamp2025.onrender.com)
- **Frontend:** [Client_Vercel](https://proyecto-final-bootcamp2025.vercel.app)

## Desafíos y Soluciones

### Desafío 1: Configuración de CORS
**Problema:** El frontend desplegado no podía comunicarse con el backend debido a errores de CORS.
**Solución:** Configuré correctamente las políticas CORS en Express especificando la URL exacta del frontend desplegado en la variable `CLIENT_URL`.

### Desafío 2: Variables de Entorno en Producción
**Problema:** La aplicación fallaba en producción porque las variables de entorno no estaban correctamente configuradas.
**Solución:** Documenté todas las variables necesarias y las configuré tanto en Render (backend) como en Vercel (frontend), asegurándome de que las URLs de producción fueran correctas.

### Desafío 3: Gestión de Estados de Autenticación
**Problema:** Los tokens JWT se perdían al refrescar la página en producción.
**Solución:** Implementé un sistema de refresh tokens y configuré correctamente el almacenamiento en cookies con configuraciones seguras para producción.

## 📂 Estructura del Proyecto

```
ProyectoFinalBootcamp/
├── client/                 # 🖥️ Frontend React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── context/       # Context API para estado global
│   │   ├── data/          # APIs y servicios
│   │   └── lib/           # Utilidades
│   ├── public/            # Assets estáticos
│   └── package.json
├── server/                # 🟢 Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Lógica de controladores
│   │   ├── models/        # Modelos de MongoDB
│   │   ├── routers/       # Rutas de la API
│   │   ├── services/      # Servicios de negocio
│   │   ├── auth/          # Sistema de autenticación
│   │   └── utils/         # Utilidades del servidor
│   └── package.json
├── db/                    # 📁 Configuración de base de datos
└── README.md             # 📖 Este documento
```

## 📖 Documentación Adicional

* **Servidor:** Para información detallada del backend, revisa el [README del server](https://github.com/millanda29/ProyectoFinalBootcamp2025/blob/main/server/README.md)
* **Cliente:** Para información detallada del frontend, revisa el [README del cliente](https://github.com/millanda29/ProyectoFinalBootcamp2025/blob/main/client/README.md)
* **API Endpoints:** Documentación completa disponible en ["/api/endpoints"](https://proyectofinalbootcamp2025.onrender.com/api/routes) cuando el servidor está ejecutándose

---

## 🎯 Funcionalidades Principales

- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Chat con IA** para planificación de viajes
- ✅ **Generación de itinerarios** personalizados
- ✅ **Gestión de presupuestos** automática
- ✅ **Reportes PDF** exportables
- ✅ **Panel de administración** completo
- ✅ **Eliminación lógica** de datos
- ✅ **Sistema de roles** (admin/traveler)
- ✅ **Diseño responsivo** para todos los dispositivos

---

> **TravelMate** - Tu compañero inteligente para planificar viajes extraordinarios ✈️🌍
> 
> *Desarrollado como proyecto final del Bootcamp de Programación - Módulo IV DevOps*

