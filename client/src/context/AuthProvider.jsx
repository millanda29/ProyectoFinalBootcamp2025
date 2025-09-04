import React, { useState, useEffect, useCallback, useMemo } from "react";
import { login as apiLogin, register as apiRegister, refreshToken, logout as apiLogout } from "../data/apiAuth";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  // Función para refrescar token, memoizada
  const verifyToken = useCallback(async () => {
    try {
      // Si el usuario hizo logout manual, no intentar refresh
      if (hasLoggedOut) {
        setAccessToken(null);
        setLoading(false);
        return;
      }

      // Primero verificar si hay token en localStorage
      const localToken = localStorage.getItem("token");
      if (localToken) {
        console.log('Found local token:', localToken); // Debug
        setAccessToken(localToken);
        setLoading(false);
        return;
      }

      console.log('No local token, trying refresh...'); // Debug
      // Si no hay token local, intentar refresh
      const data = await refreshToken();
      console.log('Refresh response:', data); // Debug
      
      const token = data?.accessToken || data?.token;
      if (token) {
        setAccessToken(token);
        localStorage.setItem("token", token);
      } else {
        setAccessToken(null);
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Token refresh failed:", err.message);
      setAccessToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [hasLoggedOut]);

  // Ejecuta verificación al montar, pero no después de logout
  useEffect(() => {
    if (!hasLoggedOut) {
      verifyToken();
    }
  }, [verifyToken, hasLoggedOut]);

  // Reset hasLoggedOut después de un tiempo para permitir login futuro
  useEffect(() => {
    if (hasLoggedOut) {
      const timer = setTimeout(() => {
        setHasLoggedOut(false);
      }, 1000); // Reset después de 1 segundo
      
      return () => clearTimeout(timer);
    }
  }, [hasLoggedOut]);

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiLogin({ email, password });
      console.log('Login response:', data); // Debug
      
      // Determinar el campo correcto del token
      const token = data.accessToken || data.token;
      
      if (!token) {
        throw new Error('No se recibió token de autenticación');
      }
      
      // Reset logout flag al hacer login exitoso
      setHasLoggedOut(false);
      
      // Actualizar ambos estados de forma síncrona
      setAccessToken(token);
      localStorage.setItem("token", token);
      
      return data;
    } catch (error) {
      console.error('Login error:', error); // Debug
      // Limpiar estado en caso de error
      setAccessToken(null);
      localStorage.removeItem("token");
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    const data = await apiRegister(userData);
    const token = data.accessToken || data.token;
    
    // Reset logout flag al hacer register exitoso
    setHasLoggedOut(false);
    
    setAccessToken(token);
    localStorage.setItem("token", token);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Llamar a la API para limpiar las cookies del servidor
      await apiLogout();
      console.log('Server logout completed'); // Debug
    } catch (error) {
      console.error('Server logout failed:', error);
      // Continuar con el logout local incluso si falla el servidor
    }
    
    // Marcar que se hizo logout manual
    setHasLoggedOut(true);
    
    // Limpiar estado local completamente
    setAccessToken(null);
    localStorage.clear(); // Limpiar todo el localStorage para estar seguros
    
    console.log('Local logout completed'); // Debug
  }, []);

  // Método para resetear completamente el estado de autenticación
  const resetAuth = useCallback(() => {
    setHasLoggedOut(false);
    setAccessToken(null);
    setLoading(true);
    localStorage.clear();
  }, []);

  // Memoriza el valor del contexto para evitar re-render innecesario
  const contextValue = useMemo(
    () => ({ accessToken, login, register, logout, resetAuth, loading, hasLoggedOut }),
    [accessToken, login, register, logout, resetAuth, loading, hasLoggedOut]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
