const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_URL = `${BASE_URL}/api/trips`;

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

// 🔹 Trip Management
export const getMyTrips = async (token, queryParams = {}) => {
  const url = new URL(`${API_URL}/my`);
  Object.keys(queryParams).forEach(key => 
    url.searchParams.append(key, queryParams[key])
  );
  
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get trips");
};

export const createTrip = async (token, tripData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(tripData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to create trip");
};

export const getTripById = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get trip");
};

export const updateTrip = async (token, tripId, tripData) => {
  const res = await fetch(`${API_URL}/${tripId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(tripData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to update trip");
};

export const deleteTrip = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to delete trip");
};

export const addCosts = async (token, tripId, costs) => {
  const res = await fetch(`${API_URL}/${tripId}/costs`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ costs }),
    credentials: "include"
  });
  return handleResponse(res, "Failed to add costs");
};

export const updateItinerary = async (token, tripId, itinerary) => {
  const res = await fetch(`${API_URL}/${tripId}/itinerary`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ itinerary }),
    credentials: "include"
  });
  return handleResponse(res, "Failed to update itinerary");
};

export const shareTrip = async (token, tripId, shareData) => {
  const res = await fetch(`${API_URL}/${tripId}/share`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(shareData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to share trip");
};

export const duplicateTrip = async (token, tripId, newTripData) => {
  const res = await fetch(`${API_URL}/${tripId}/duplicate`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(newTripData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to duplicate trip");
};

export const markTripCompleted = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    credentials: "include"
  });
  return handleResponse(res, "Failed to mark trip as completed");
};

export const cancelTrip = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}/cancel`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    credentials: "include"
  });
  return handleResponse(res, "Failed to cancel trip");
};

export const generateReport = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}/pdf`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  
  if (!res.ok) {
    throw new Error(`Error al descargar PDF: ${res.status}`);
  }
  
  // Retornar el blob directamente para PDF
  return await res.blob();
};

export const exportTrip = async (token, tripId, format = 'json') => {
  const res = await fetch(`${API_URL}/${tripId}/export?format=${format}`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to export trip");
};

// 🔹 Trip Reports Management
export const getTripReports = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}/reports`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get trip reports");
};

export const servePDF = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}/pdf`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  
  if (!res.ok) {
    throw new Error(`Error al descargar PDF: ${res.status}`);
  }
  
  // Retornar el blob directamente para PDF
  return await res.blob();
};

// 🔹 Admin Trip Management
export const getAllTrips = async (token, queryParams = {}) => {
  const url = new URL(API_URL);
  Object.keys(queryParams).forEach(key => 
    url.searchParams.append(key, queryParams[key])
  );
  
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get all trips");
};

export const cleanupOrphanedPDFs = async (token) => {
  const res = await fetch(`${API_URL}/cleanup/orphaned-pdfs`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to cleanup orphaned PDFs");
};

export const getDeletedTrips = async (token) => {
  const res = await fetch(`${API_URL}/deleted`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get deleted trips");
};

export const restoreTrip = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}/restore`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to restore trip");
};

export const permanentlyDeleteTrip = async (token, tripId) => {
  const res = await fetch(`${API_URL}/${tripId}/permanent`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to permanently delete trip");
};

export const getTripsByStatus = async (token, status, queryParams = {}) => {
  const url = new URL(`${API_URL}/admin/by-status/${status}`);
  Object.keys(queryParams).forEach(key => 
    url.searchParams.append(key, queryParams[key])
  );
  
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get trips by status");
};
