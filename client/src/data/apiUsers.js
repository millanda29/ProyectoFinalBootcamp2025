const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_URL = `${BASE_URL}/api/users`;

// Helper para manejar respuestas
const handleResponse = async (res, defaultErrorMsg) => {
  // Obtener el texto de la respuesta primero
  const text = await res.text();
  
  if (!res.ok) {
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      // Si no es JSON válido, usar el texto completo como error
      throw new Error(`${defaultErrorMsg}: ${text || 'Unknown error'}`);
    }
    throw new Error(errorData.message || defaultErrorMsg);
  }
  
  // Para respuestas exitosas, intentar parsear como JSON
  try {
    const jsonData = JSON.parse(text);
    
    // Verificar si la respuesta tiene la estructura esperada
    if (jsonData.success && jsonData.data) {
      return jsonData;
    } else if (jsonData.data) {
      return jsonData;
    } else {
      // Si no tiene la estructura esperada, envolver la respuesta
      return {
        success: true,
        data: jsonData
      };
    }
  } catch {
    // Si no es JSON válido, podría ser un token u otra respuesta de texto
    // Envolver en la estructura esperada
    return {
      success: true,
      data: {
        response: text,
        message: text
      }
    };
  }
};

// Helper para obtener headers con autorización
const getAuthHeaders = (token) => ({
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
});

// 🔹 User Profile Management
export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/me`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get profile");
};

export const getFullProfile = async (token) => {
  const res = await fetch(`${API_URL}/me/full`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get full profile");
};

export const updateProfile = async (token, profileData) => {
  const res = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(profileData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to update profile");
};

export const updateTravelPreferences = async (token, preferences) => {
  const res = await fetch(`${API_URL}/me/preferences`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(preferences),
    credentials: "include"
  });
  return handleResponse(res, "Failed to update travel preferences");
};

export const updateNotifications = async (token, notifications) => {
  const res = await fetch(`${API_URL}/me/notifications`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(notifications),
    credentials: "include"
  });
  return handleResponse(res, "Failed to update notifications");
};

export const getTravelHistory = async (token) => {
  const res = await fetch(`${API_URL}/me/trips`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get travel history");
};

export const changePassword = async (token, passwordData) => {
  const res = await fetch(`${API_URL}/me/change-password`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(passwordData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to change password");
};

export const findSimilarUsers = async (token, queryParams = {}) => {
  const url = new URL(`${API_URL}/similar`);
  Object.keys(queryParams).forEach(key => 
    url.searchParams.append(key, queryParams[key])
  );
  
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to find similar users");
};

// 🔹 Admin User Management
export const getAllUsers = async (token, queryParams = {}) => {
  const url = new URL(`${API_URL}/admin/all`);
  Object.keys(queryParams).forEach(key => 
    url.searchParams.append(key, queryParams[key])
  );
  
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get all users");
};

export const createUser = async (token, userData) => {
  const res = await fetch(`${API_URL}/admin/create`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to create user");
};

export const getUserById = async (token, userId) => {
  const res = await fetch(`${API_URL}/admin/${userId}`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get user by ID");
};

export const updateUser = async (token, userId, userData) => {
  const res = await fetch(`${API_URL}/admin/${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to update user");
};

export const deleteUser = async (token, userId) => {
  const res = await fetch(`${API_URL}/admin/${userId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to delete user");
};

export const resetPassword = async (token, userId, passwordData) => {
  const res = await fetch(`${API_URL}/admin/${userId}/reset-password`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(passwordData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to reset password");
};

export const getStats = async (token) => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get stats");
};
