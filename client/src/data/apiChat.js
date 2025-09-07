const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_URL = `${BASE_URL}/api/chat`;

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

// ✅ ENDPOINTS EXISTENTES EN EL SERVIDOR (según api-endpoints.json)

// 🔹 Generar itinerario básico - POST /api/chat/itinerary
export const generateBasicItinerary = async (token, itineraryData) => {
  const res = await fetch(`${API_URL}/itinerary`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(itineraryData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to generate itinerary");
};

// 🔹 Generar itinerario para un viaje específico - POST /api/chat/trip/:tripId/itinerary
export const generateTripItinerary = async (token, tripId, preferences) => {
  const res = await fetch(`${API_URL}/trip/${tripId}/itinerary`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(preferences),
    credentials: "include"
  });
  return handleResponse(res, "Failed to generate trip itinerary");
};

// 🔹 Chat con asistente de IA - POST /api/chat/assistant
export const chatAssistant = async (token, chatData) => {
  const res = await fetch(`${API_URL}/assistant`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(chatData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to send chat message");
};
