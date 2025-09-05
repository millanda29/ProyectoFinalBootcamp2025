// 🔹 Central API Client - TravelMate
// Punto de entrada principal para todas las operaciones de API

// Import API modules
import * as auth from './apiAuth.js';
import * as users from './apiUsers.js';
import * as trips from './apiTrips.js';
import * as chat from './apiChat.js';

// Import utilities and types
import {
  handleApiResponse,
  handleNetworkError,
  ApiError,
  validateEmail,
  validatePassword,
  validateRequired,
  validateName,
  validatePhone,
  validatePasswordMatch,
  getPasswordStrength,
  validateForm,
  formatCurrency,
  formatDate,
  formatDateTime,
  buildUrl,
  replaceParams,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  debounce,
  retry,
  deepClone,
  safeJsonParse,
  showSuccess,
  showError,
  createLoadingState,
} from './apiUtils.js';

import {
  HTTP_STATUS,
  TRIP_STATUS,
  ACTIVITY_CATEGORIES,
  COST_TYPES,
  USER_ROLES,
  TRAVEL_STYLES,
  CURRENCIES,
  LANGUAGES,
  NOTIFICATION_TYPES,
  CHAT_MESSAGE_TYPES,
  EXPORT_FORMATS,
  PAGINATION,
  VALIDATION,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  DEFAULTS,
} from './apiTypes.js';

// 🔹 Configuración general de la API
export const API_CONFIG = {
  baseUrl: 'http://localhost:4000/api',
  version: '1.0.0',
  timeout: 30000, // 30 segundos
};

// 🔹 Interceptor para manejar tokens automáticamente
const originalFetch = window.fetch;

window.fetch = async function(url, options = {}) {
  // Solo interceptar si es una llamada a nuestra API
  if (typeof url === 'string' && (url.includes('/api/') || url.startsWith('http://localhost:4000'))) {
    const token = localStorage.getItem('token');
    
    // Añadir token a headers si existe y no es una ruta de auth
    if (token && !url.includes('/auth/login') && !url.includes('/auth/register')) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    try {
      const response = await originalFetch.call(this, url, options);
      
      // Si recibimos 401 (token expirado) y no es una llamada de refresh
      if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login') && !url.includes('/auth/register')) {
        // Intentar renovar el token
        try {
          const refreshResponse = await originalFetch.call(this, `${API_CONFIG.baseUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            
            if (refreshData.token) {
              // Actualizar tokens en localStorage
              localStorage.setItem('token', refreshData.token);
              if (refreshData.refreshToken) {
                localStorage.setItem('refreshToken', refreshData.refreshToken);
              }
              
              // Reintentar la petición original con el nuevo token
              options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${refreshData.token}`
              };
              
              return originalFetch.call(this, url, options);
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
        
        // Si falla el refresh, limpiar tokens y redirigir al login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Redirigir al login solo si no estamos ya ahí
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
  
  // Para URLs que no son de nuestra API, usar fetch normal
  return originalFetch.call(this, url, options);
};

// 🔹 Helper para obtener el token del localStorage
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

// 🔹 Helper para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getStoredToken();
  return !!token;
};

// 🔹 Exportar todas las funciones de autenticación
export const authAPI = {
  login: auth.login,
  register: auth.register,
  refreshToken: auth.refreshToken,
  logout: auth.logout,
};

// 🔹 Exportar todas las funciones de usuarios
export const usersAPI = {
  // Profile management
  getProfile: (token = getStoredToken()) => users.getProfile(token),
  getFullProfile: (token = getStoredToken()) => users.getFullProfile(token),
  updateProfile: (profileData, token = getStoredToken()) => users.updateProfile(token, profileData),
  updateTravelPreferences: (preferences, token = getStoredToken()) => users.updateTravelPreferences(token, preferences),
  updateNotifications: (notifications, token = getStoredToken()) => users.updateNotifications(token, notifications),
  getTravelHistory: (token = getStoredToken()) => users.getTravelHistory(token),
  changePassword: (passwordData, token = getStoredToken()) => users.changePassword(token, passwordData),
  findSimilarUsers: (queryParams, token = getStoredToken()) => users.findSimilarUsers(token, queryParams),
  
  // Admin functions
  admin: {
    getAllUsers: (queryParams, token = getStoredToken()) => users.getAllUsers(token, queryParams),
    createUser: (userData, token = getStoredToken()) => users.createUser(token, userData),
    getUserById: (userId, token = getStoredToken()) => users.getUserById(token, userId),
    updateUser: (userId, userData, token = getStoredToken()) => users.updateUser(token, userId, userData),
    deleteUser: (userId, token = getStoredToken()) => users.deleteUser(token, userId),
    resetPassword: (userId, passwordData, token = getStoredToken()) => users.resetPassword(token, userId, passwordData),
    getStats: (token = getStoredToken()) => users.getStats(token),
  }
};

// 🔹 Exportar todas las funciones de viajes
export const tripsAPI = {
  getMyTrips: (queryParams, token = getStoredToken()) => trips.getMyTrips(token, queryParams),
  createTrip: (tripData, token = getStoredToken()) => trips.createTrip(token, tripData),
  getTripById: (tripId, token = getStoredToken()) => trips.getTripById(token, tripId),
  updateTrip: (tripId, tripData, token = getStoredToken()) => trips.updateTrip(token, tripId, tripData),
  deleteTrip: (tripId, token = getStoredToken()) => trips.deleteTrip(token, tripId),
  addCosts: (tripId, costs, token = getStoredToken()) => trips.addCosts(token, tripId, costs),
  updateItinerary: (tripId, itinerary, token = getStoredToken()) => trips.updateItinerary(token, tripId, itinerary),
  shareTrip: (tripId, shareData, token = getStoredToken()) => trips.shareTrip(token, tripId, shareData),
  duplicateTrip: (tripId, newTripData, token = getStoredToken()) => trips.duplicateTrip(token, tripId, newTripData),
  markTripCompleted: (tripId, token = getStoredToken()) => trips.markTripCompleted(token, tripId),
  cancelTrip: (tripId, token = getStoredToken()) => trips.cancelTrip(token, tripId),
  generatePdfReport: (tripId, token = getStoredToken()) => trips.generatePdfReport(token, tripId),
  exportTrip: (tripId, format, token = getStoredToken()) => trips.exportTrip(token, tripId, format),
};

// 🔹 Exportar todas las funciones de chat/IA
export const chatAPI = {
  generateBasicItinerary: (itineraryData, token = getStoredToken()) => chat.generateBasicItinerary(token, itineraryData),
  generateTripItinerary: (tripId, preferences, token = getStoredToken()) => chat.generateTripItinerary(token, tripId, preferences),
  chatAssistant: (chatData, token = getStoredToken()) => chat.chatAssistant(token, chatData),
  chatAssistantStream: (chatData, onMessage, token = getStoredToken()) => chat.chatAssistantStream(token, chatData, onMessage),
  
  // Conversation management
  getChatHistory: (conversationId, token = getStoredToken()) => chat.getChatHistory(token, conversationId),
  clearChatHistory: (conversationId, token = getStoredToken()) => chat.clearChatHistory(token, conversationId),
  getMyConversations: (token = getStoredToken()) => chat.getMyConversations(token),
  
  // AI suggestions
  getDestinationSuggestions: (preferences, token = getStoredToken()) => chat.getDestinationSuggestions(token, preferences),
  getBudgetEstimate: (tripDetails, token = getStoredToken()) => chat.getBudgetEstimate(token, tripDetails),
  getActivityRecommendations: (destination, preferences, token = getStoredToken()) => chat.getActivityRecommendations(token, destination, preferences),
  getWeatherInfo: (destination, dates, token = getStoredToken()) => chat.getWeatherInfo(token, destination, dates),
  getTravelTips: (destination, token = getStoredToken()) => chat.getTravelTips(token, destination),
};

// 🔹 Exportar funciones utilitarias
export const apiUtils = {
  getStoredToken,
  isAuthenticated,
  
  // Función para hacer peticiones genéricas
  request: async (endpoint, options = {}) => {
    const token = getStoredToken();
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },
  
  // Función para construir query parameters
  buildQueryParams: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  },
};

// 🔹 Exportar utilidades para validación y manejo de errores
export const utils = {
  // Error handling
  handleApiResponse,
  handleNetworkError,
  ApiError,
  
  // Validations
  validateEmail,
  validatePassword,
  validateRequired,
  validateName,
  validatePhone,
  validatePasswordMatch,
  getPasswordStrength,
  validateForm,
  
  // Formatting
  formatCurrency,
  formatDate,
  formatDateTime,
  
  // URL utilities
  buildUrl,
  replaceParams,
  
  // Storage utilities
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  
  // General utilities
  debounce,
  retry,
  deepClone,
  safeJsonParse,
  showSuccess,
  showError,
  createLoadingState,
};

// 🔹 Exportar constantes y tipos
export const constants = {
  HTTP_STATUS,
  TRIP_STATUS,
  ACTIVITY_CATEGORIES,
  COST_TYPES,
  USER_ROLES,
  TRAVEL_STYLES,
  CURRENCIES,
  LANGUAGES,
  NOTIFICATION_TYPES,
  CHAT_MESSAGE_TYPES,
  EXPORT_FORMATS,
  PAGINATION,
  VALIDATION,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  DEFAULTS,
};

// 🔹 Exportación por defecto con todas las APIs
export default {
  auth: authAPI,
  users: usersAPI,
  trips: tripsAPI,
  chat: chatAPI,
  utils,
  constants,
  config: API_CONFIG,
};
