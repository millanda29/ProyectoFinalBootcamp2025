const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_URL = `${BASE_URL}/api/auth`;

// Helper para manejar respuestas
const handleResponse = async (res, defaultErrorMsg) => {
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      throw new Error(defaultErrorMsg);
    }
    throw new Error(errorData.message || defaultErrorMsg);
  }
  return res.json();
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
