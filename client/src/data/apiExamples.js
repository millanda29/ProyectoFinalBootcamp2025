// 🔹 API Usage Examples - TravelMate
// Ejemplos de cómo usar el cliente de API

import { useState } from 'react';

// Importar el cliente completo
import api, { utils, constants } from './api.js';

// 🔹 Ejemplo 1: Autenticación
export const authExamples = {
  // Login básico
  async login(email, password) {
    try {
      // Validar datos antes de enviar
      const emailError = utils.validateEmail(email);
      const passwordError = utils.validatePassword(password);
      
      if (emailError || passwordError) {
        throw new Error(emailError || passwordError);
      }
      
      const response = await api.auth.login(email, password);
      utils.showSuccess(constants.SUCCESS_MESSAGES.LOGIN_SUCCESS);
      return response;
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
  
  // Registro con validación completa
  async register(userData) {
    try {
      // Validar todos los campos
      const validation = utils.validateForm(userData, {
        email: [utils.validateEmail],
        password: [utils.validatePassword],
        firstName: [utils.validateName],
        lastName: [utils.validateName],
        phone: [utils.validatePhone],
      });
      
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        throw new Error(firstError);
      }
      
      // Verificar que las contraseñas coincidan
      const passwordMatchError = utils.validatePasswordMatch(
        userData.password,
        userData.confirmPassword
      );
      
      if (passwordMatchError) {
        throw new Error(passwordMatchError);
      }
      
      const response = await api.auth.register(userData);
      utils.showSuccess(constants.SUCCESS_MESSAGES.REGISTER_SUCCESS);
      return response;
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
};

// 🔹 Ejemplo 2: Gestión de perfil de usuario
export const userExamples = {
  // Obtener perfil con manejo de errores
  async getProfile() {
    try {
      const profile = await api.users.getProfile();
      return profile;
    } catch (error) {
      if (error.status === 401) {
        // Redirigir al login
        window.location.href = '/login';
      }
      utils.showError(error);
      throw error;
    }
  },
  
  // Actualizar preferencias de viaje
  async updateTravelPreferences(preferences) {
    try {
      const updatedProfile = await api.users.updateTravelPreferences(preferences);
      utils.showSuccess('Preferencias actualizadas correctamente');
      return updatedProfile;
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
  
  // Cambiar contraseña con validación
  async changePassword(oldPassword, newPassword, confirmPassword) {
    try {
      // Validar nueva contraseña
      const passwordError = utils.validatePassword(newPassword);
      if (passwordError) {
        throw new Error(passwordError);
      }
      
      // Verificar que coincidan
      const matchError = utils.validatePasswordMatch(newPassword, confirmPassword);
      if (matchError) {
        throw new Error(matchError);
      }
      
      await api.users.changePassword({
        oldPassword,
        newPassword,
      });
      
      utils.showSuccess(constants.SUCCESS_MESSAGES.PASSWORD_CHANGED);
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
};

// 🔹 Ejemplo 3: Gestión de viajes
export const tripExamples = {
  // Crear viaje con datos completos
  async createTrip(tripData) {
    try {
      // Validar datos requeridos
      const validation = utils.validateForm(tripData, {
        destination: [utils.validateRequired],
        startDate: [utils.validateRequired],
        endDate: [utils.validateRequired],
        budget: [(value) => {
          if (!value || value <= 0) return 'El presupuesto debe ser mayor a 0';
          return null;
        }],
      });
      
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        throw new Error(firstError);
      }
      
      const newTrip = await api.trips.createTrip(tripData);
      utils.showSuccess(constants.SUCCESS_MESSAGES.TRIP_CREATED);
      return newTrip;
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
  
  // Obtener viajes con paginación
  async getMyTrips(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = {
        page,
        limit,
        ...filters,
      };
      
      const trips = await api.trips.getMyTrips(queryParams);
      return trips;
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
  
  // Exportar viaje a PDF
  async exportTripToPDF(tripId) {
    try {
      const pdfBlob = await api.trips.exportToPDF(tripId);
      
      // Crear link de descarga
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `viaje-${tripId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      utils.showSuccess('PDF descargado exitosamente');
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
};

// 🔹 Ejemplo 4: Chat con IA
export const chatExamples = {
  // Generar itinerario básico
  async generateItinerary(preferences) {
    try {
      const itinerary = await api.chat.generateItinerary(preferences);
      return itinerary;
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
  
  // Chat con streaming
  async chatWithAssistant(message, onMessageChunk) {
    try {
      await api.chat.chatWithAssistantStream({
        message,
        onMessage: onMessageChunk,
        onError: (error) => {
          utils.showError(error);
        },
      });
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
  
  // Obtener recomendaciones de actividades
  async getActivityRecommendations(destination, preferences) {
    try {
      const recommendations = await api.chat.getActivityRecommendations({
        destination,
        ...preferences,
      });
      return recommendations;
    } catch (error) {
      utils.showError(error);
      throw error;
    }
  },
};

// 🔹 Ejemplo 5: Utilidades de formateo
export const formatExamples = {
  // Formatear moneda
  formatPrice(amount, currency = 'USD') {
    return utils.formatCurrency(amount, currency);
  },
  
  // Formatear fechas
  formatTripDate(date) {
    return utils.formatDate(date, 'es-ES');
  },
  
  // Formatear fecha y hora
  formatLastUpdate(dateTime) {
    return utils.formatDateTime(dateTime, 'es-ES');
  },
  
  // Validar fortaleza de contraseña
  checkPasswordStrength(password) {
    return utils.getPasswordStrength(password);
  },
};

// 🔹 Ejemplo 6: Manejo de estado de carga
export const loadingExamples = {
  // Crear estado de carga para componente
  createLoadingState() {
    return utils.createLoadingState();
  },
  
  // Hook personalizado de loading (para React)
  useLoading() {
    const [isLoading, setIsLoading] = useState(false);
    
    const withLoading = async (asyncFn) => {
      setIsLoading(true);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        setIsLoading(false);
      }
    };
    
    return { isLoading, withLoading };
  },
};

// 🔹 Ejemplo 7: Retry con exponential backoff
export const retryExamples = {
  // Función con retry automático
  async fetchWithRetry(fetchFn, maxRetries = 3) {
    return utils.retry(fetchFn, maxRetries, 1000);
  },
  
  // Ejemplo de uso
  async getProfileWithRetry() {
    return this.fetchWithRetry(() => api.users.getProfile());
  },
};

// 🔹 Ejemplo 8: Debounce para búsquedas
export const searchExamples = {
  // Búsqueda con debounce
  createDebouncedSearch(searchFn, delay = 300) {
    return utils.debounce(searchFn, delay);
  },
  
  // Ejemplo de búsqueda de destinos
  setupDestinationSearch() {
    const debouncedSearch = this.createDebouncedSearch(async (query) => {
      if (query.length >= 2) {
        try {
          const suggestions = await api.chat.getDestinationSuggestions({ query });
          return suggestions;
        } catch (error) {
          utils.showError(error);
          return [];
        }
      }
      return [];
    });
    
    return debouncedSearch;
  },
};

// 🔹 Ejemplo completo de uso en componente React
export const componentExample = `
// Ejemplo de componente React usando el API client

import React, { useState, useEffect } from 'react';
import api, { utils, constants } from '../data/api.js';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.trips.getMyTrips({
        page: 1,
        limit: 10,
        status: constants.TRIP_STATUS.PLANNED
      });
      
      setTrips(response.trips);
      utils.showSuccess('Viajes cargados correctamente');
    } catch (error) {
      setError(error.message);
      utils.showError(error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    try {
      const newTrip = await api.trips.createTrip(tripData);
      setTrips(prev => [newTrip, ...prev]);
      utils.showSuccess(constants.SUCCESS_MESSAGES.TRIP_CREATED);
    } catch (error) {
      utils.showError(error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {trips.map(trip => (
        <div key={trip._id}>
          <h3>{trip.destination}</h3>
          <p>Presupuesto: {utils.formatCurrency(trip.budget)}</p>
          <p>Fecha: {utils.formatDate(trip.startDate)}</p>
        </div>
      ))}
    </div>
  );
};

export default TripList;
`;
