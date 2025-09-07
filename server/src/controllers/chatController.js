import chatService from "../services/chatService.js";

// Generar itinerario básico (sin guardar en trip)
export const getItinerary = async (req, res, next) => {
  try {
    const { destination, startDate, endDate, partySize, budget } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false,
        message: "destination, startDate y endDate son requeridos" 
      });
    }

    const itinerary = await chatService.generateItinerary({ 
      destination, 
      startDate, 
      endDate, 
      partySize,
      budget 
    });

    res.status(200).json({ 
      success: true,
      data: itinerary 
    });
  } catch (error) {
    next(error);
  }
};

// Generar itinerario para un trip específico y guardarlo
export const generateTripItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const result = await chatService.generateItineraryForTrip(tripId, userId);

    res.status(200).json({
      success: true,
      data: result,
      message: "Itinerario generado y guardado exitosamente"
    });
  } catch (error) {
    next(error);
  }
};

// Chat interactivo con el asistente
export const chatAssistant = async (req, res, next) => {
  try {
    const { message, tripId } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const result = await chatService.chatWithAssistant(message, tripId, userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
