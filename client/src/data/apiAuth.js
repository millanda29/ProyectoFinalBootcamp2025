const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_URL = `${BASE_URL}/api/auth`;

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

// 🔹 Login
export const login = async ({ email, password }) => {
  
  const requestBody = { email, password };
  
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    credentials: "include"
  });

  const responseText = await res.text();
  
  if (!res.ok) {
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch {
      throw new Error('Login failed - Invalid response format');
    }
    throw new Error(errorData.message || 'Login failed');
  }

  try {
    const data = JSON.parse(responseText);
    return data;
  } catch (parseError) {
    console.error('Failed to parse response:', parseError);
    throw new Error('Login failed - Invalid response format');
  }
};


// 🔹 Register
export const register = async (userData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include"
  });

  return handleResponse(res, "Register failed");
};

// 🔹 Refresh token
export const refreshToken = async () => {
  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST", // 🔑 mejor usar POST
    credentials: "include"
  });

  return handleResponse(res, "Failed to refresh token");
};

// 🔹 Logout
export const logout = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include"
  });

  return handleResponse(res, "Logout failed");
};
