import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { accessToken, loading, hasLoggedOut } = useAuth();

  // Si está cargando
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-700 text-base font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay token y ya terminó la carga
  if (!accessToken) {
    // Si el usuario acaba de hacer logout, redirigir a home
    if (hasLoggedOut) {
      return <Navigate to="/" replace />;
    }
    // Si no está autenticado desde el inicio, redirigir a login
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderiza los children
  return children;
};

export default ProtectedRoute;