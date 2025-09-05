// 🔹 API Types and Constants - TravelMate
// Este archivo contiene constantes y tipos utilizados en toda la aplicación

// 🔹 API Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// 🔹 Trip Status
export const TRIP_STATUS = {
  PLANNED: 'planned',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// 🔹 Trip Activity Categories
export const ACTIVITY_CATEGORIES = {
  LODGING: 'lodging',
  TRANSPORTATION: 'transportation',
  SIGHTSEEING: 'sightseeing',
  DINING: 'dining',
  ENTERTAINMENT: 'entertainment',
  SHOPPING: 'shopping',
  ROMANTIC: 'romantic',
  ADVENTURE: 'adventure',
  CULTURAL: 'cultural',
  RELAXATION: 'relaxation',
};

// 🔹 Cost Types
export const COST_TYPES = {
  LODGING: 'lodging',
  TRANSPORTATION: 'transportation',
  FOOD: 'food',
  ACTIVITIES: 'activities',
  SHOPPING: 'shopping',
  EMERGENCY: 'emergency',
  OTHER: 'other',
};

// 🔹 User Roles
export const USER_ROLES = {
  TRAVELER: 'traveler',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// 🔹 Travel Styles
export const TRAVEL_STYLES = {
  BUDGET: 'budget',
  BALANCED: 'balanced',
  COMFORT: 'comfort',
  LUXURY: 'luxury',
};

// 🔹 Currencies
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY',
  CAD: 'CAD',
  AUD: 'AUD',
  CHF: 'CHF',
  CNY: 'CNY',
  MXN: 'MXN',
  BRL: 'BRL',
};

// 🔹 Languages
export const LANGUAGES = {
  ES: 'es',
  EN: 'en',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  JA: 'ja',
  ZH: 'zh',
};

// 🔹 Notification Types
export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms',
  MARKETING: 'marketing',
};

// 🔹 Chat Message Types
export const CHAT_MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

// 🔹 Export Formats
export const EXPORT_FORMATS = {
  JSON: 'json',
  PDF: 'pdf',
  CSV: 'csv',
  EXCEL: 'excel',
};

// 🔹 Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// 🔹 Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[\d\s\-()]+$/,
};

// 🔹 Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// 🔹 Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Intenta más tarde.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  REQUIRED_FIELD: 'Este campo es requerido.',
  INVALID_EMAIL: 'El email no es válido.',
  PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres.`,
  PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden.',
};

// 🔹 Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
  REGISTER_SUCCESS: 'Cuenta creada exitosamente.',
  PROFILE_UPDATED: 'Perfil actualizado correctamente.',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente.',
  TRIP_CREATED: 'Viaje creado exitosamente.',
  TRIP_UPDATED: 'Viaje actualizado correctamente.',
  TRIP_DELETED: 'Viaje eliminado exitosamente.',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente.',
};

// 🔹 API Endpoints (para referencia)
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_LOGOUT: '/api/auth/logout',
  
  // Users
  USERS_PROFILE: '/api/users/me',
  USERS_FULL_PROFILE: '/api/users/me/full',
  USERS_PREFERENCES: '/api/users/me/preferences',
  USERS_NOTIFICATIONS: '/api/users/me/notifications',
  USERS_TRAVEL_HISTORY: '/api/users/me/trips',
  USERS_CHANGE_PASSWORD: '/api/users/me/change-password',
  USERS_SIMILAR: '/api/users/similar',
  
  // Admin Users
  ADMIN_USERS_ALL: '/api/users/admin/all',
  ADMIN_USERS_CREATE: '/api/users/admin/create',
  ADMIN_USERS_BY_ID: '/api/users/admin/:id',
  ADMIN_USERS_RESET_PASSWORD: '/api/users/admin/:id/reset-password',
  ADMIN_STATS: '/api/users/admin/stats',
  
  // Trips
  TRIPS_MY: '/api/trips/my',
  TRIPS_CREATE: '/api/trips',
  TRIPS_BY_ID: '/api/trips/:id',
  TRIPS_COSTS: '/api/trips/:id/costs',
  TRIPS_ITINERARY: '/api/trips/:id/itinerary',
  TRIPS_SHARE: '/api/trips/:id/share',
  TRIPS_DUPLICATE: '/api/trips/:id/duplicate',
  TRIPS_COMPLETE: '/api/trips/:id/complete',
  TRIPS_CANCEL: '/api/trips/:id/cancel',
  TRIPS_PDF: '/api/trips/:id/pdf',
  TRIPS_EXPORT: '/api/trips/:id/export',
  
  // Chat/AI
  CHAT_ITINERARY: '/api/chat/itinerary',
  CHAT_TRIP_ITINERARY: '/api/chat/trip/:tripId/itinerary',
  CHAT_ASSISTANT: '/api/chat/assistant',
  CHAT_ASSISTANT_STREAM: '/api/chat/assistant/stream',
  CHAT_CONVERSATIONS: '/api/chat/conversations/my',
  CHAT_CONVERSATION_BY_ID: '/api/chat/conversations/:id',
  CHAT_CLEAR_HISTORY: '/api/chat/conversations/:id/clear',
  CHAT_SUGGESTIONS_DESTINATIONS: '/api/chat/suggestions/destinations',
  CHAT_ESTIMATE_BUDGET: '/api/chat/estimate/budget',
  CHAT_RECOMMENDATIONS_ACTIVITIES: '/api/chat/recommendations/activities',
  CHAT_INFO_WEATHER: '/api/chat/info/weather',
  CHAT_TIPS: '/api/chat/tips/:destination',
};

// 🔹 Default Values
export const DEFAULTS = {
  TRIP: {
    partySize: 1,
    budget: 1000,
    status: TRIP_STATUS.PLANNED,
  },
  USER_PREFERENCES: {
    currency: CURRENCIES.USD,
    language: LANGUAGES.EN,
    travelStyle: TRAVEL_STYLES.BALANCED,
  },
  PAGINATION: {
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
  },
};
