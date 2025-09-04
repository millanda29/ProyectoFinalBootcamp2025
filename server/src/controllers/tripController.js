import tripService from '../services/tripService.js';
import reportService from '../services/reportService.js';

// Solo admin puede ver todos los viajes
const getAllTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getAllTrips();
    res.json({
      success: true,
      data: trips,
      count: trips.length
    });
  } catch (err) {
    next(err);
  }
};

// Historial del usuario autenticado
const getMyTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getTripsByUser(req.user.id);
    res.json({
      success: true,
      data: trips,
      count: trips.length
    });
  } catch (err) {
    next(err);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }
    
    // Verificar que el usuario puede acceder al trip
    if (trip.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    
    res.json({
      success: true,
      data: trip
    });
  } catch (err) {
    next(err);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const newTrip = await tripService.createTrip({
      ...req.body,
      userId: req.user.id, // asociar al usuario logueado
    });
    res.status(201).json({
      success: true,
      data: newTrip,
      message: "Trip created successfully"
    });
  } catch (err) {
    next(err);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }
    
    // Verificar que el usuario puede modificar el trip
    if (trip.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    
    const updatedTrip = await tripService.updateTrip(req.params.id, req.body);
    res.json({
      success: true,
      data: updatedTrip,
      message: "Trip updated successfully"
    });
  } catch (err) {
    next(err);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }
    
    // Verificar que el usuario puede eliminar el trip
    if (trip.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    
    await tripService.deleteTrip(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Agregar costos a un trip
const addCosts = async (req, res, next) => {
  try {
    const { costs } = req.body;
    if (!Array.isArray(costs)) {
      return res.status(400).json({
        success: false,
        message: "Costs must be an array"
      });
    }
    
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }
    
    // Verificar acceso
    if (trip.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    
    const updatedTrip = await tripService.addCosts(req.params.id, costs);
    res.json({
      success: true,
      data: updatedTrip,
      message: "Costs added successfully"
    });
  } catch (err) {
    next(err);
  }
};

// Actualizar itinerario
const updateItinerary = async (req, res, next) => {
  try {
    const { itinerary } = req.body;
    if (!Array.isArray(itinerary)) {
      return res.status(400).json({
        success: false,
        message: "Itinerary must be an array"
      });
    }
    
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }
    
    // Verificar acceso
    if (trip.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    
    const updatedTrip = await tripService.updateItinerary(req.params.id, itinerary);
    res.json({
      success: true,
      data: updatedTrip,
      message: "Itinerary updated successfully"
    });
  } catch (err) {
    next(err);
  }
};

// Generar reporte PDF del trip
const generateReport = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }
    
    // Verificar acceso
    if (trip.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Generar el PDF
    const reportData = await reportService.generateTripReportPDF(trip, req.user);
    
    // Guardar información del reporte en el trip
    const reportInfo = {
      fileUrl: reportData.fileUrl,
      format: 'pdf',
      generatedAt: new Date()
    };
    
    await tripService.addReport(req.params.id, reportInfo);
    
    res.json({
      success: true,
      data: {
        downloadUrl: reportData.fileUrl,
        fileName: reportData.fileName,
        generatedAt: reportInfo.generatedAt
      },
      message: "Reporte PDF generado exitosamente"
    });
    
  } catch (err) {
    next(err);
  }
};

// Obtener todos los reportes de un trip
const getTripReports = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }
    
    // Verificar acceso
    if (trip.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    
    res.json({
      success: true,
      data: trip.reports,
      count: trip.reports.length
    });
  } catch (err) {
    next(err);
  }
};

export default { 
  getAllTrips, 
  getMyTrips, 
  getTripById, 
  createTrip, 
  updateTrip, 
  deleteTrip,
  addCosts,
  updateItinerary,
  generateReport,
  getTripReports
};