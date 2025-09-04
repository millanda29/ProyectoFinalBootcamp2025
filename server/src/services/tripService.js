import Trip from '../models/Trip.js';
import User from '../models/User.js';

const tripService = {
  async getAllTrips() {
    return await Trip.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
  },

  async getTripsByUser(userId) {
    return await Trip.find({ userId })
      .sort({ createdAt: -1 });
  },

  async getTripById(tripId) {
    return await Trip.findById(tripId)
      .populate('userId', 'fullName email');
  },

  async createTrip(tripData) {
    const newTrip = new Trip(tripData);
    await newTrip.save();
    
    // Agregar el trip al usuario
    await User.findByIdAndUpdate(
      tripData.userId,
      { $push: { createdTrips: newTrip._id } }
    );
    
    return newTrip;
  },

  async updateTrip(tripId, updatedData) {
    return await Trip.findByIdAndUpdate(
      tripId, 
      { ...updatedData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );
  },

  async deleteTrip(tripId) {
    const trip = await Trip.findById(tripId);
    if (!trip) return null;
    
    // Remover el trip del usuario
    await User.findByIdAndUpdate(
      trip.userId,
      { $pull: { createdTrips: tripId } }
    );
    
    return await Trip.findByIdAndDelete(tripId);
  },

  // Agregar conversación de IA al trip
  async addAiConversation(tripId, messages) {
    return await Trip.findByIdAndUpdate(
      tripId,
      { 
        $push: { 
          aiConversations: {
            startedAt: new Date(),
            messages
          }
        }
      },
      { new: true }
    );
  },

  // Actualizar itinerario con datos de IA
  async updateItinerary(tripId, itinerary) {
    return await Trip.findByIdAndUpdate(
      tripId,
      { itinerary },
      { new: true }
    );
  },

  // Agregar costos al trip
  async addCosts(tripId, costs) {
    return await Trip.findByIdAndUpdate(
      tripId,
      { $push: { costs: { $each: costs } } },
      { new: true }
    );
  },

  // Agregar reporte al trip
  async addReport(tripId, reportData) {
    return await Trip.findByIdAndUpdate(
      tripId,
      { $push: { reports: reportData } },
      { new: true }
    );
  }
};

export default tripService;