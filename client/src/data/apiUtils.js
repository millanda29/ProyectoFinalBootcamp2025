// 🔹 API Utilities - TravelMate
// Utilidades para el manejo de APIs, errores y validaciones

import { ERROR_MESSAGES, SUCCESS_MESSAGES, VALIDATION } from './apiTypes.js';

// 🔹 Error Handler
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// 🔹 Handle API Response
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    let errorData = null;

    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
      errorData = errorBody;
    } catch {
      // Si no se puede parsear el JSON, usar mensaje por defecto
    }

    switch (response.status) {
      case 400:
        errorMessage = errorData?.message || ERROR_MESSAGES.VALIDATION_ERROR;
        break;
      case 401:
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case 403:
        errorMessage = ERROR_MESSAGES.FORBIDDEN;
        break;
      case 404:
        errorMessage = ERROR_MESSAGES.NOT_FOUND;
        break;
      case 500:
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
        break;
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  return response.json();
};

// 🔹 Handle Network Error
export const handleNetworkError = (error) => {
  console.error('🔴 Network Error:', error);
  
  if (error instanceof ApiError) {
    throw error;
  }
  
  if (error.name === 'TypeError' || error.message.includes('fetch')) {
    throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
  }
  
  throw new ApiError(error.message || ERROR_MESSAGES.SERVER_ERROR, 500);
};

// 🔹 Validation Functions
export const validateEmail = (email) => {
  if (!email) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (!VALIDATION.EMAIL_PATTERN.test(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return null;
};

export const validatePassword = (password) => {
  if (!password) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }
  return null;
};

export const validateRequired = (value, fieldName = '') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return fieldName ? `${fieldName} es requerido` : ERROR_MESSAGES.REQUIRED_FIELD;
  }
  return null;
};

export const validateName = (name) => {
  if (!name) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (name.length < VALIDATION.NAME_MIN_LENGTH) {
    return `El nombre debe tener al menos ${VALIDATION.NAME_MIN_LENGTH} caracteres`;
  }
  if (name.length > VALIDATION.NAME_MAX_LENGTH) {
    return `El nombre no puede tener más de ${VALIDATION.NAME_MAX_LENGTH} caracteres`;
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Teléfono es opcional
  if (!VALIDATION.PHONE_PATTERN.test(phone)) {
    return 'El formato del teléfono no es válido';
  }
  return null;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
  }
  return null;
};

// 🔹 Password Strength Checker
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password),
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  if (score <= 2) {
    return { score, label: 'Débil', color: 'bg-red-500', checks };
  } else if (score <= 3) {
    return { score, label: 'Regular', color: 'bg-yellow-500', checks };
  } else if (score <= 4) {
    return { score, label: 'Buena', color: 'bg-blue-500', checks };
  } else {
    return { score, label: 'Excelente', color: 'bg-green-500', checks };
  }
};

// 🔹 Form Validation Helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 🔹 Format Utilities
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date, locale = 'es-ES') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date, locale = 'es-ES') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// 🔹 URL Utilities
export const buildUrl = (baseUrl, path, params = {}) => {
  const url = new URL(path, baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

export const replaceParams = (path, params) => {
  let newPath = path;
  
  Object.entries(params).forEach(([key, value]) => {
    newPath = newPath.replace(`:${key}`, value);
  });
  
  return newPath;
};

// 🔹 Local Storage Utilities
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
};

// 🔹 Debounce Utility
export const debounce = (func, delay) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// 🔹 Retry Utility
export const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      console.warn(`Retry ${i + 1}/${retries} failed:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// 🔹 Deep Clone Utility
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// 🔹 Safe JSON Parse
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

// 🔹 Success Notification Helper
export const showSuccess = (message) => {
  console.log('✅ Success:', message);
  // Aquí puedes integrar con tu sistema de notificaciones (toast, etc.)
};

// 🔹 Error Notification Helper
export const showError = (error) => {
  const message = error instanceof ApiError ? error.message : ERROR_MESSAGES.SERVER_ERROR;
  console.error('❌ Error:', message);
  // Aquí puedes integrar con tu sistema de notificaciones (toast, etc.)
};

// 🔹 Loading State Helper
export const createLoadingState = () => {
  let isLoading = false;
  const listeners = new Set();
  
  return {
    get isLoading() {
      return isLoading;
    },
    
    setLoading(loading) {
      isLoading = loading;
      listeners.forEach(listener => listener(loading));
    },
    
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};
