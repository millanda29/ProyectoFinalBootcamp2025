const API_URL = "http://localhost:4000/api/auth";

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
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include"
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }

  return res.json(); // { accessToken }
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
  // Devuelve: { token, refreshToken, user }
};

// 🔹 Refresh token
export const refreshToken = async () => {
  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST", // 🔑 mejor usar POST
    credentials: "include"
  });

  return handleResponse(res, "Failed to refresh token");
  // Devuelve: { token }
};

// 🔹 Logout
export const logout = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include"
  });

  return handleResponse(res, "Logout failed");
  // Devuelve: { message: "Logged out" }
};
