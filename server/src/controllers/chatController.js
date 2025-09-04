import chatService from "../services/chatService.js";

export const getItinerary = async (req, res, next) => {
  try {
    const { destination, startDate, endDate } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ message: "destination, startDate y endDate son requeridos" });
    }

    const itinerary = await chatService.generateItinerary({ destination, startDate, endDate });
    res.status(200).json({ itinerary });
  } catch (error) {
    next(error);
  }
};
