import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatService = {
  async generateItinerary({ destination, startDate, endDate }) {
    const prompt = `
Eres un asistente de viajes.
Crea un itinerario de viaje para el destino "${destination}"
desde ${startDate} hasta ${endDate}.
Incluye actividades recomendadas por día, con breves descripciones.
Devuelve la respuesta en JSON solamente, sin comillas invertidas ni markdown.
Ejemplo:
{
  "destination": "Paris",
  "days": [
    {
      "day": "Día 1",
      "activities": ["Tour por el Louvre", "Paseo por Montmartre"]
    }
  ]
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
};

export default chatService;
