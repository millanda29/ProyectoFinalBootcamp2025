# 🖥️ Frontend – TravelMate

Este directorio contiene la **interfaz web de TravelMate**, desarrollada en React.  
Permite a los usuarios interactuar con el chatbot, ver itinerarios, estimar presupuestos y descargar reportes. ✈️🗺️🎨

---

## 🛠️ Tecnologías

- ⚛️ **React** – Librería para construir la interfaz de usuario  
- ⚡ **Vite** – Herramienta de build rápida para desarrollo React  
- 🎨 **CSS3** – Estilos y diseño visual  
- 🟢 **JavaScript** – Lógica de interacción y comunicación con backend  

---

## 🌟 Características

- Interfaz interactiva y responsiva  
- ChatBot de IA integrado para planificación de viajes  
- Visualización de itinerarios y presupuestos en tiempo real  
- Descarga de reportes en PDF  

---

## 📂 Estructura principal

```

client/
├── public/         # Archivos estáticos (imágenes, index.html)
├── src/            # Código fuente de la aplicación
│   ├── assets/     # Imágenes y recursos
│   ├── App.jsx     # Componente principal
│   ├── main.jsx    # Punto de entrada
│   └── index.css   # Estilos globales
├── package.json    # Dependencias y scripts
├── vite.config.js  # Configuración de Vite
└── README.md       # Este documento

````

---

## 🏷️ Scripts del `package.json`

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
````

### Explicación de cada script

1. **`dev`** – ⚡ Modo desarrollo

   ```bash
   npm run dev
   ```

   * Ejecuta la app con **Vite** en modo desarrollo.
   * Permite recarga automática al guardar cambios.
   * URL por defecto: `http://localhost:5173`

2. **`build`** – 📦 Build para producción

   ```bash
   npm run build
   ```

   * Genera la versión optimizada de la app en la carpeta `dist/`.
   * Preparada para desplegar en cualquier servidor (Render, Vercel, etc.).

3. **`lint`** – 🔍 Verificación de código

   ```bash
   npm run lint
   ```

   * Ejecuta **ESLint** en todo el proyecto (`.`).
   * Detecta errores de sintaxis y problemas de estilo para mantener la calidad del código.

4. **`preview`** – 👀 Vista previa de producción

   ```bash
   npm run preview
   ```

   * Sirve la versión construida (`dist/`) localmente.
   * Permite verificar cómo se verá la app en producción antes de desplegarla.

---

## 📖 Documentación general

* Para detalles de la instalación y ejecución completa del proyecto, revisa el [README principal](../README.md).
* Para detalles del **backend**, revisa el [README del server](../server/README.md).

---

> Este README sirve como guía rápida del cliente, referencia de su estructura, tecnologías y scripts. ✨

