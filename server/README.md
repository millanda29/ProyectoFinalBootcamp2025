# 🟢 Backend – TravelMate

Este directorio contiene el **backend de TravelMate**, desarrollado con Node.js y Express.  
Se encarga de la gestión de usuarios, itinerarios, presupuesto, integración con IA y generación de reportes. 🖥️🗃️🤖

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

