# Travel Management API - Documentación Swagger

Esta API está completamente documentada con Swagger/OpenAPI 3.0. La documentación interactiva está disponible cuando el servidor está ejecutándose.

## 🚀 Acceso a la Documentación

### Swagger UI (Documentación Interactiva)
- **URL**: `http://localhost:4000/api-docs`
- **Descripción**: Interfaz interactiva donde puedes:
  - Ver todos los endpoints disponibles
  - Probar los endpoints directamente desde el navegador
  - Ver ejemplos de requests y responses
  - Entender la estructura de datos

### Endpoints del Sistema
- **Health Check**: `GET /api/health` - Verificar estado de la API
- **Listar Rutas**: `GET /api/routes` - Ver todas las rutas disponibles

## 📋 Categorías de Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token de acceso
- `POST /api/auth/logout` - Cerrar sesión
- `PUT /api/auth/change-password` - Cambiar contraseña

### 👤 Users (`/api/users`)
**Endpoints de Usuario:**
- `GET /api/users/me` - Obtener perfil del usuario
- `GET /api/users/me/full` - Obtener perfil completo
- `PUT /api/users/me` - Actualizar perfil
- `GET /api/users/me/trips` - Obtener historial de viajes
- `PUT /api/users/me/change-password` - Cambiar contraseña
- `POST /api/users/me/schedule-deletion` - Programar eliminación de cuenta
- `DELETE /api/users/me/cancel-deletion` - Cancelar eliminación
- `DELETE /api/users/me` - Eliminar cuenta inmediatamente
- `PUT /api/users/me/preferences` - Actualizar preferencias de viaje
- `PUT /api/users/me/notifications` - Actualizar configuración de notificaciones
- `PUT /api/users/me/stats` - Actualizar estadísticas
- `GET /api/users/similar` - Encontrar usuarios similares

**Endpoints de Administración (requieren rol admin):**
- `GET /api/users/admin/stats` - Estadísticas generales
- `GET /api/users/admin/all` - Obtener todos los usuarios
- `POST /api/users/admin/create` - Crear nuevo usuario
- `GET /api/users/admin/:id` - Obtener usuario por ID
- `PUT /api/users/admin/:id` - Actualizar usuario
- `DELETE /api/users/admin/:id` - Eliminar usuario (lógica)
- `PUT /api/users/admin/:id/reset-password` - Resetear contraseña
- `GET /api/users/admin/deleted` - Obtener usuarios eliminados
- `POST /api/users/admin/:id/restore` - Restaurar usuario
- `DELETE /api/users/admin/:id/permanent` - Eliminar permanentemente

### ✈️ Trips (`/api/trips`)
**Endpoints de Usuario:**
- `GET /api/trips/my` - Obtener mis viajes
- `POST /api/trips` - Crear nuevo viaje
- `GET /api/trips/:id` - Obtener viaje por ID
- `PUT /api/trips/:id` - Actualizar viaje
- `DELETE /api/trips/:id` - Eliminar viaje (lógica)
- `PUT /api/trips/:id/costs` - Agregar/actualizar costos
- `PUT /api/trips/:id/itinerary` - Actualizar itinerario
- `POST /api/trips/:id/report` - Generar reporte PDF
- `GET /api/trips/:id/reports` - Obtener lista de reportes
- `GET /api/trips/:id/pdf` - Descargar PDF del viaje

**Endpoints de Administración (requieren rol admin):**
- `GET /api/trips` - Obtener todos los viajes
- `GET /api/trips/deleted` - Obtener viajes eliminados
- `POST /api/trips/:id/restore` - Restaurar viaje
- `DELETE /api/trips/:id/permanent` - Eliminar permanentemente
- `DELETE /api/trips/cleanup/orphaned-pdfs` - Limpiar PDFs huérfanos

### 🤖 Chat & AI (`/api/chat`)
- `POST /api/chat/itinerary` - Generar itinerario con IA
- `POST /api/chat/trip/:tripId/itinerary` - Generar itinerario para viaje existente
- `POST /api/chat/assistant` - Chat con asistente de viajes IA

## 🔑 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación:

1. **Registro/Login**: Obtén un `accessToken`
2. **Authorization Header**: Incluye en todas las requests protegidas:
   ```
   Authorization: Bearer <tu-access-token>
   ```
3. **Refresh Token**: Se almacena como httpOnly cookie para renovar el accessToken

### Ejemplo de uso en Swagger UI:
1. Usa el endpoint `/api/auth/login` para obtener un token
2. Copia el `accessToken` de la respuesta
3. Haz click en el botón "Authorize" en la parte superior de Swagger UI
4. Pega el token en el campo "Value" (sin "Bearer ")
5. Ahora puedes probar todos los endpoints protegidos

## 📊 Modelos de Datos

### User
- Información personal y de contacto
- Preferencias de viaje (moneda, idioma, estilo, etc.)
- Configuración de notificaciones
- Estadísticas de viajes
- Roles y permisos

### Trip
- Información básica del viaje
- Itinerario detallado por días
- Costos y presupuesto
- Reportes en PDF
- Conversaciones con IA
- Eliminación lógica

### Estructuras de Soporte
- **Activities**: Actividades del itinerario
- **Costs**: Gastos del viaje
- **Reports**: Reportes generados
- **AI Messages**: Conversaciones con IA

## 🛠️ Funcionalidades Especiales

### Eliminación Lógica
- Los usuarios y viajes se eliminan lógicamente (soft delete)
- Los administradores pueden restaurar elementos eliminados
- Limpieza de archivos huérfanos

### Generación de Reportes
- PDFs automáticos de viajes
- Incluye itinerario y costos
- Almacenamiento y gestión de archivos

### Inteligencia Artificial
- Generación de itinerarios personalizados
- Asistente de chat para consejos de viaje
- Integración con OpenAI

### Administración
- Panel completo para administradores
- Estadísticas y métricas
- Gestión de usuarios y viajes

## 🔧 Configuración de Desarrollo

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno** (`.env`):
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/travel-management
   JWT_SECRET=tu-jwt-secret-super-secreto
   JWT_REFRESH_SECRET=tu-refresh-secret-super-secreto
   OPENAI_API_KEY=tu-openai-api-key
   ```

3. **Iniciar servidor**:
   ```bash
   npm start        # Producción
   npm run dev      # Desarrollo con nodemon
   ```

4. **Acceder a Swagger UI**:
   ```
   http://localhost:4000/api-docs
   ```

## 📝 Notas de Desarrollo

- Todos los endpoints están documentados con ejemplos completos
- Los esquemas de datos están definidos para validación automática
- Los códigos de error están estandarizados
- La documentación se actualiza automáticamente al modificar el código

## 🚀 Próximos Pasos

Para agregar nuevos endpoints:

1. Crea el endpoint en el router correspondiente
2. Agrega la documentación Swagger usando comentarios `@swagger`
3. Define los esquemas necesarios en `src/config/swagger.js`
4. La documentación se actualizará automáticamente

¡La API está lista para usar con documentación completa e interactiva! 🎉