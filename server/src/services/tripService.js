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
    
    // Usar eliminación lógica en lugar de física
    await trip.softDelete();
    
    return trip;
  },

  // Restaurar trip eliminado (solo admin)
  async restoreTrip(tripId) {
    const trip = await Trip.findById(tripId).setOptions({ includeDeleted: true });
    if (!trip) return null;
    
    if (!trip.isDeleted) {
      throw new Error('El viaje no está eliminado');
    }
    
    await trip.restore();
    return trip;
  },

  // Obtener trips eliminados (solo admin)
  async getDeletedTrips() {
    return await Trip.find({ isDeleted: true }).setOptions({ includeDeleted: true })
      .populate('userId', 'fullName email')
      .populate('deletedBy', 'fullName email');
  },

  // Eliminación física permanente (solo admin)
  async permanentlyDeleteTrip(tripId) {
    const trip = await Trip.findById(tripId).setOptions({ includeDeleted: true });
    if (!trip) return null;
    
    // Limpiar archivos PDF asociados antes de borrar permanentemente
    await this.cleanupTripReports(tripId);
    
    // Remover el trip del usuario si aún existe la referencia
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
  },

  // Limpiar archivos de reportes antes de eliminar el trip
  async cleanupTripReports(tripId) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip || !trip.reports || trip.reports.length === 0) {
        return { success: true, deletedFiles: 0 };
      }

      let deletedFiles = 0;
      for (const report of trip.reports) {
        if (report.format === 'pdf' && report.fileUrl) {
          try {
            const reportService = await import('./reportService.js');
            const success = await reportService.default.deletePDFFile(report.fileUrl);
            if (success) deletedFiles++;
          } catch (error) {
            // Error eliminando reporte individual
          }
        }
      }

      return { success: true, deletedFiles };
    } catch (error) {
      console.error('Error limpiando reportes del trip:', error);
      return { success: false, deletedFiles: 0 };
    }
  }
};

export default tripService;