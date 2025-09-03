import Trip from '../models/Trip.js';

const tripService = {
  async getAllTrips() {
    return await Trip.find();
  },

  async getTripById(tripId) {
    return await Trip.findById(tripId);
  },

  async createTrip(tripData) {
    const newTrip = new Trip({ ...tripData, createdAt: new Date(), updatedAt: new Date() });
    await newTrip.save();
    return newTrip;
  },

  async updateTrip(tripId, updatedData) {
    return await Trip.findByIdAndUpdate(tripId, updatedData, { new: true });
  },

  async deleteTrip(tripId) {
    return await Trip.findByIdAndDelete(tripId);
  },
};

export default tripService;
