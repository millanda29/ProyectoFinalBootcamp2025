import dotenv from "dotenv";
import OpenAI from "openai";
import tripService from "./tripService.js";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatService = {
  async generateItinerary({ destination, startDate, endDate, partySize = 1, budget = null }) {
    const budgetInfo = budget ? `con un presupuesto aproximado de ${budget} USD` : '';
    
    const prompt = `
Eres un asistente experto en viajes.
Crea un itinerario detallado de viaje para ${partySize} persona(s) al destino "${destination}"
desde ${startDate} hasta ${endDate} ${budgetInfo}.

Incluye:
1. Actividades recomendadas por día con horarios sugeridos
2. Lugares específicos para visitar
3. Recomendaciones de restaurantes
4. Estimación de costos aproximados por categoría (alojamiento, transporte, actividades, comida)

Devuelve la respuesta en JSON solamente, sin comillas invertidas ni markdown.
Ejemplo:
{
  "destination": "Paris",
  "duration": "3 días",
  "partySize": 2,
  "days": [
    {
      "dayNumber": 1,
      "date": "2024-01-15",
      "activities": [
        {
          "title": "Visita al Louvre",
          "category": "Cultural",
          "startTime": "09:00",
          "endTime": "12:00",
          "location": "Museo del Louvre, Paris"
        }
      ]
    }
  ],
  "estimatedCosts": [
    {
      "type": "lodging",
      "label": "Hotel por noche",
      "currency": "USD",
      "amount": 120,
      "quantity": 3
    },
    {
      "type": "transport",
      "label": "Metro pases diarios",
      "currency": "USD", 
      "amount": 15,
      "quantity": 3
    }
  ],
  "totalEstimate": 450
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let text = response.choices[0].message.content;

    // Limpiar posibles ```json``` o ``` que vienen en la respuesta
    text = text.replace(/```json|```/g, "").trim();

    try {
      const json = JSON.parse(text);
      return json;
    } catch (err) {
      console.error("Error parsing AI response:", text);
      throw new Error("Error parsing AI response: " + err.message);
    }
  },

  async generateItineraryForTrip(tripId, userId) {
    try {
      const trip = await tripService.getTripById(tripId);
      if (!trip) {
        throw new Error("Trip not found");
      }

      // Verificar que el usuario tiene acceso al trip
      if (trip.userId.toString() !== userId) {
        throw new Error("Access denied");
      }

      const itineraryData = await this.generateItinerary({
        destination: trip.destination,
        startDate: trip.startDate.toISOString().split('T')[0],
        endDate: trip.endDate.toISOString().split('T')[0],
        partySize: trip.partySize
      });

      // Convertir el formato de respuesta de IA al formato del modelo Trip
      const formattedItinerary = itineraryData.days.map(day => ({
        dayNumber: day.dayNumber,
        notes: `Día ${day.dayNumber} en ${trip.destination}`,
        activities: day.activities
      }));

      // Actualizar el trip con el itinerario
      const updatedTrip = await tripService.updateItinerary(tripId, formattedItinerary);

      // Si hay costos estimados, agregarlos al trip
      if (itineraryData.estimatedCosts && itineraryData.estimatedCosts.length > 0) {
        await tripService.addCosts(tripId, itineraryData.estimatedCosts);
      }

      // Guardar la conversación de IA
      const aiMessages = [
        {
          role: "user",
          content: `Generar itinerario para ${trip.destination} del ${trip.startDate.toISOString().split('T')[0]} al ${trip.endDate.toISOString().split('T')[0]}`
        },
        {
          role: "assistant", 
          content: JSON.stringify(itineraryData)
        }
      ];

      await tripService.addAiConversation(tripId, aiMessages);

      return {
        trip: updatedTrip,
        itinerary: itineraryData
      };

    } catch (error) {
      console.error("Error generating itinerary for trip:", error);
      throw error;
    }
  },

  async chatWithAssistant(message, tripId = null, userId) {
    try {
      let context = "";
      let trip = null;

      if (tripId) {
        trip = await tripService.getTripById(tripId);
        if (!trip) {
          throw new Error("Trip not found");
        }

        // Verificar acceso
        if (trip.userId.toString() !== userId) {
          throw new Error("Access denied");
        }

        context = `
Contexto del viaje:
- Destino: ${trip.destination}
- Fechas: ${trip.startDate.toISOString().split('T')[0]} al ${trip.endDate.toISOString().split('T')[0]}
- Personas: ${trip.partySize}
- Estado: ${trip.status}
${trip.itinerary.length > 0 ? `- Itinerario actual: ${trip.itinerary.length} días planificados` : ''}
${trip.costs.length > 0 ? `- Presupuesto actual: ${trip.costs.reduce((sum, c) => sum + (c.amount * c.quantity), 0)} USD` : ''}
`;
      }

      const prompt = `
Eres TravelMate, un asistente inteligente de viajes. Ayuda al usuario con sus consultas de viaje.
${context}

Usuario pregunta: ${message}

Responde de manera útil y concisa. Si es necesario, puedes sugerir modificaciones al itinerario o presupuesto.
`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const assistantResponse = response.choices[0].message.content;

      // Si hay un trip asociado, guardar la conversación
      if (tripId && trip) {
        const aiMessages = [
          {
            role: "user",
            content: message
          },
          {
            role: "assistant",
            content: assistantResponse
          }
        ];

        await tripService.addAiConversation(tripId, aiMessages);
      }

      return {
        response: assistantResponse,
        tripContext: tripId ? {
          id: trip._id,
          destination: trip.destination,
          status: trip.status
        } : null
      };

    } catch (error) {
      console.error("Error in chat assistant:", error);
      throw error;
    }
  }
};

export default chatService;
