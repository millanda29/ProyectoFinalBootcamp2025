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
    console.log('🔧 extractUserData: Analizando respuesta:', response);
    
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
        console.log(`✅ extractUserData: Usuario encontrado en path ${i}:`, userData);
        console.log(`🔐 extractUserData: Rol extraído:`, userData.role);
        return userData;
      }
    }
    
    console.log('❌ extractUserData: No se pudo extraer usuario de la respuesta');
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
            console.log('🔍 AuthProvider: Intentando cargar perfil con token:', localToken?.substring(0, 20) + '...');
            const userProfileResponse = await api.users.getProfile(localToken);
            console.log('📊 AuthProvider: Respuesta getProfile:', userProfileResponse);
            
            const userData = extractUserData(userProfileResponse);
            if (userData) {
              setUser(userData);
            } else {
              console.log('❌ AuthProvider: No se pudo extraer datos de usuario');
            }
          } catch (error) {
            console.error('❌ AuthProvider: Failed to load user profile on init:', error);
            console.log('🔍 AuthProvider: Token usado:', localToken?.substring(0, 20) + '...');
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
      console.log('🔐 AuthProvider Login: Iniciando login para:', email);
      const data = await api.auth.login({ email, password });
      console.log('📊 AuthProvider Login: Respuesta completa:', data);
      
      // La respuesta tiene token y refreshToken
      const token = data.token;
      const refresh = data.refreshToken;
      
      if (!token) {
        throw new Error('No se recibió token de autenticación');
      }
      
      console.log('🔑 AuthProvider Login: Token recibido:', token?.substring(0, 20) + '...');
      
      // Reset logout flag al hacer login exitoso
      setHasLoggedOut(false);
      
      // Actualizar ambos estados de forma síncrona
      setAccessToken(token);
      localStorage.setItem("token", token);
      
      if (refresh) {
        setRefreshToken(refresh);
        localStorage.setItem("refreshToken", refresh);
      }
      
      // Guardar información del usuario si viene en la respuesta
      console.log('� AuthProvider Login: Respuesta completa:', JSON.stringify(data, null, 2));
      
      const userData = extractUserData(data);
      if (userData) {
        setUser(userData);
      } else {
        // Si no se puede extraer de la respuesta, intentar cargar el perfil
        console.log('🔍 AuthProvider Login: No hay usuario en respuesta, cargando perfil...');
        try {
          console.log('🔍 AuthProvider Login: Cargando perfil separadamente...');
          const userProfileResponse = await api.users.getProfile(token);
          console.log('📊 AuthProvider Login: Respuesta getProfile:', userProfileResponse);
          
          const profileUserData = extractUserData(userProfileResponse);
          if (profileUserData) {
            setUser(profileUserData);
          } else {
            console.log('❌ AuthProvider Login: No se pudo extraer usuario del perfil');
          }
        } catch (error) {
          console.error('❌ AuthProvider Login: Error al cargar perfil:', error);
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
    const data = await api.auth.register(userData);
    
    // La respuesta tiene token y refreshToken
    const token = data.token;
    const refresh = data.refreshToken;
    
    if (!token) {
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
