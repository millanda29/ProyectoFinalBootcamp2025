// 🔹 API Index - TravelMate
// Archivo de índice para facilitar las importaciones

// Exportar el cliente principal
export { default } from './api.js';

// Exportar utilidades y constantes
export { utils, constants } from './api.js';

// Exportar APIs específicas
export { authAPI, usersAPI, tripsAPI, chatAPI } from './api.js';

// Re-exportar módulos individuales para uso directo
export * as auth from './apiAuth.js';
export * as users from './apiUsers.js';
export * as trips from './apiTrips.js';
export * as chat from './apiChat.js';

// Re-exportar utilidades para uso directo
export * from './apiUtils.js';
export * from './apiTypes.js';
