import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../data/api";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null); // Información del usuario
  const [loading, setLoading] = useState(true);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  // Helper para extraer datos de usuario de diferentes estructuras de respuesta
  const extractUserData = (response) => {
    
    // Posibles ubicaciones del usuario en la respuesta
    const possiblePaths = [
      response.user,           // respuesta.user
      response.data?.user,     // respuesta.data.user  
      response.data,           // respuesta.data
      response                 // respuesta directa
    ];
    
    for (let i = 0; i < possiblePaths.length; i++) {
      const userData = possiblePaths[i];
      if (userData && (userData.email || userData.id)) {
        return userData;
      }
    }
    return null;
  };

  // Ejecuta verificación al montar SOLO UNA VEZ
  useEffect(() => {
    let isInitialized = false;
    
    const initializeAuth = async () => {
      // Evitar ejecuciones múltiples
      if (isInitialized) return;
      isInitialized = true;
      
      try {
        // Primero verificar si hay tokens en localStorage
        const localToken = localStorage.getItem("token");
        const localRefreshToken = localStorage.getItem("refreshToken");
        
        if (localToken) {
          setAccessToken(localToken);
          if (localRefreshToken) {
            setRefreshToken(localRefreshToken);
          }
          
          // Intentar cargar datos del usuario con el token guardado
          try {
            
            const userProfileResponse = await api.users.getProfile(localToken);
            
            const userData = extractUserData(userProfileResponse);
            if (userData) {
              setUser(userData);
            }
          } catch (error) {
            console.error('❌ AuthProvider: Failed to load user profile on init:', error);
            // Si falla cargar el perfil, mantener el token pero sin datos de usuario
          }
          
          setLoading(false);
          return;
        }

        // Si no hay token local, NO intentar refresh automáticamente
        setAccessToken(null);
        setRefreshToken(null);
        setLoading(false);
      } catch (err) {
        console.error("Token verification failed:", err.message);
        setAccessToken(null);
        setRefreshToken(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Sin dependencias para ejecutar solo una vez

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
      
      const response = await api.auth.login({ email, password });
      
      
      // La respuesta puede venir envuelta en data o directamente
      const data = response.data || response;
      
      // La respuesta tiene token y refreshToken
      const token = data.token;
      const refresh = data.refreshToken;
      
      if (!token) {
        throw new Error('No se recibió token de autenticación');
      }
      
      // Reset logout flag al hacer login exitoso
      setHasLoggedOut(false);
      
      // Actualizar ambos estados de forma síncrona
      setAccessToken(token);
      localStorage.setItem("token", token);
      
      if (refresh) {
        setRefreshToken(refresh);
        localStorage.setItem("refreshToken", refresh);
      }
      
      const userData = extractUserData(data);
      if (userData) {
        setUser(userData);
      } else {
        try {
          const userProfileResponse = await api.users.getProfile(token);
          
          const profileUserData = extractUserData(userProfileResponse);
          if (profileUserData) {
            setUser(profileUserData);
          }
        } catch (error) {
          console.error('Error al cargar perfil:', error);
        }
      }
      
      return data;
    } catch (error) {
      // Limpiar estado en caso de error
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    const response = await api.auth.register(userData);
    
    // La respuesta puede venir envuelta en data o directamente
    const data = response.data || response;
    
    // La respuesta tiene token y refreshToken
    const token = data.token;
    const refresh = data.refreshToken;
    
    if (!token) {
      console.error('Response structure:', response);
      throw new Error('No se recibió token de autenticación');
    }
    
    // Reset logout flag al hacer register exitoso
    setHasLoggedOut(false);
    
    setAccessToken(token);
    localStorage.setItem("token", token);
    
    if (refresh) {
      setRefreshToken(refresh);
      localStorage.setItem("refreshToken", refresh);
    }
    
    // Guardar información del usuario si viene en la respuesta
    if (data.user) {
      setUser(data.user);
    } else {
      // Si no viene en la respuesta, intentar cargar el perfil
      try {
        const userProfile = await api.users.getProfile();
        setUser(userProfile);
      } catch (error) {
        console.warn('Failed to load user profile after register:', error);
      }
    }
    
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      // Llamar a la API para limpiar las cookies del servidor
      await api.auth.logout();
    } catch (error) {
      console.error('Server logout failed:', error);
      // Continuar con el logout local incluso si falla el servidor
    }
    
    // Marcar que se hizo logout manual
    setHasLoggedOut(true);
    
    // Limpiar estado local completamente
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null); // Limpiar datos del usuario
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }, []);

  // Función para renovar el token automáticamente
  const renewToken = useCallback(async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const data = await api.auth.refreshToken();
      
      const newToken = data.token;
      const newRefreshToken = data.refreshToken;
      
      if (newToken) {
        setAccessToken(newToken);
        localStorage.setItem("token", newToken);
        
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        
        return newToken;
      } else {
        throw new Error('No new token received');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Si falla el refresh, cerrar sesión
      await logout();
      throw error;
    }
  }, [refreshToken, logout]);

  // Método para resetear completamente el estado de autenticación
  const resetAuth = useCallback(() => {
    setHasLoggedOut(false);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null); // Limpiar datos del usuario
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }, []);

  // Memoriza el valor del contexto para evitar re-render innecesario
  const contextValue = useMemo(
    () => ({ 
      accessToken, 
      refreshToken, 
      user, // Añadir datos del usuario al contexto
      login, 
      register, 
      logout, 
      resetAuth, 
      renewToken,
      loading, 
      hasLoggedOut 
    }),
    [accessToken, refreshToken, user, login, register, logout, resetAuth, renewToken, loading, hasLoggedOut]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
