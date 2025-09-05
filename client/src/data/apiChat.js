const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_URL = `${BASE_URL}/api/chat`;

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

// Helper para obtener headers con autorización
const getAuthHeaders = (token) => ({
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
});

// 🔹 AI Chat & Itinerary Generation
export const generateBasicItinerary = async (token, itineraryData) => {
  const res = await fetch(`${API_URL}/itinerary`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(itineraryData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to generate basic itinerary");
};

export const generateTripItinerary = async (token, tripId, preferences) => {
  const res = await fetch(`${API_URL}/trip/${tripId}/itinerary`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(preferences),
    credentials: "include"
  });
  return handleResponse(res, "Failed to generate trip itinerary");
};

export const chatAssistant = async (token, chatData) => {
  const res = await fetch(`${API_URL}/assistant`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(chatData),
    credentials: "include"
  });
  return handleResponse(res, "Failed to chat with assistant");
};

// 🔹 Streaming Chat (para respuestas en tiempo real)
export const chatAssistantStream = async (token, chatData, onMessage) => {
  const res = await fetch(`${API_URL}/assistant/stream`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(chatData),
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Failed to start chat stream");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onMessage(data);
          } catch (error) {
            console.warn('Failed to parse SSE data:', line, error);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};

// 🔹 Conversation Management
export const getChatHistory = async (token, conversationId) => {
  const res = await fetch(`${API_URL}/conversations/${conversationId}`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get chat history");
};

export const clearChatHistory = async (token, conversationId) => {
  const res = await fetch(`${API_URL}/conversations/${conversationId}/clear`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to clear chat history");
};

export const getMyConversations = async (token) => {
  const res = await fetch(`${API_URL}/conversations/my`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get conversations");
};

// 🔹 AI Suggestions & Recommendations
export const getDestinationSuggestions = async (token, preferences) => {
  const res = await fetch(`${API_URL}/suggestions/destinations`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(preferences),
    credentials: "include"
  });
  return handleResponse(res, "Failed to get destination suggestions");
};

export const getBudgetEstimate = async (token, tripDetails) => {
  const res = await fetch(`${API_URL}/estimate/budget`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(tripDetails),
    credentials: "include"
  });
  return handleResponse(res, "Failed to get budget estimate");
};

export const getActivityRecommendations = async (token, destination, preferences) => {
  const res = await fetch(`${API_URL}/recommendations/activities`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ destination, preferences }),
    credentials: "include"
  });
  return handleResponse(res, "Failed to get activity recommendations");
};

export const getWeatherInfo = async (token, destination, dates) => {
  const res = await fetch(`${API_URL}/info/weather`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ destination, dates }),
    credentials: "include"
  });
  return handleResponse(res, "Failed to get weather info");
};

export const getTravelTips = async (token, destination) => {
  const res = await fetch(`${API_URL}/tips/${encodeURIComponent(destination)}`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });
  return handleResponse(res, "Failed to get travel tips");
};
