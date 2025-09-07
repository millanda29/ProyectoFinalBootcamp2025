import tripService from '../services/tripService.js';
import reportService from '../services/reportService.js';
import path from 'path';
import fs from 'fs/promises';

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

    // ✅ Solo dueño puede acceder
    if (trip.userId.id !== req.user.id) {
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

    // ✅ Solo dueño puede modificar
    if (trip.userId.id !== req.user.id) {
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

    // ✅ Solo dueño puede eliminar
    if (trip.userId._id ? trip.userId._id.toString() !== req.user.id : trip.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Usar eliminación lógica
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

    // ✅ Solo dueño puede agregar costos
    if (trip.userId.id !== req.user.id) {
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

    // ✅ Solo dueño puede actualizar itinerario
    if (trip.userId.id !== req.user.id) {
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

    // ✅ Solo dueño puede generar reporte
    if (trip.userId._id ? trip.userId._id.toString() !== req.user.id : trip.userId.toString() !== req.user.id) {
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

    // ✅ Solo dueño puede ver reportes
    if (trip.userId.id !== req.user.id) {
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

// Servir archivos PDF
const servePDF = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }

    // ✅ Solo dueño puede descargar el PDF
    if (trip.userId._id ? trip.userId._id.toString() !== req.user.id : trip.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Buscar si existe un reporte PDF para este trip
    const report = trip.reports.find(r => r.format === 'pdf');
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No PDF report found for this trip"
      });
    }

    // Construir la ruta del archivo
    const fileName = path.basename(report.fileUrl);
    const filePath = path.join(process.cwd(), 'reports', fileName);

    try {
      await fs.access(filePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.sendFile(path.resolve(filePath));
    } catch (fileError) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found on server"
      });
    }

  } catch (err) {
    next(err);
  }
};

// Función de administración para limpiar PDFs huérfanos
const cleanupOrphanedPDFs = async (req, res, next) => {
  try {
    // Solo administradores pueden ejecutar esta función
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    // Obtener todos los reportes existentes
    const trips = await tripService.getAllTrips();
    const allReports = [];
    trips.forEach(trip => {
      if (trip.reports) {
        allReports.push(...trip.reports);
      }
    });

    const deletedCount = await reportService.cleanOrphanedPDFs(allReports);
    
    res.json({
      success: true,
      message: `Limpieza completada. ${deletedCount} archivos PDF huérfanos eliminados.`,
      deletedFiles: deletedCount
    });
  } catch (err) {
    next(err);
  }
};

// ===== FUNCIONES ADMIN PARA ELIMINACIÓN LÓGICA =====

// Obtener trips eliminados (solo admin)
const getDeletedTrips = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    const deletedTrips = await tripService.getDeletedTrips();
    res.json({
      success: true,
      data: deletedTrips,
      count: deletedTrips.length
    });
  } catch (err) {
    next(err);
  }
};

// Restaurar trip eliminado (solo admin)
const restoreTrip = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    const trip = await tripService.restoreTrip(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    res.json({
      success: true,
      data: trip,
      message: "Trip restored successfully"
    });
  } catch (err) {
    next(err);
  }
};

// Eliminar trip permanentemente (solo admin)
const permanentlyDeleteTrip = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    const trip = await tripService.permanentlyDeleteTrip(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    res.json({
      success: true,
      message: "Trip permanently deleted"
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
  getTripReports,
  servePDF,
  cleanupOrphanedPDFs,
  // Nuevos endpoints admin para eliminación lógica
  getDeletedTrips,
  restoreTrip,
  permanentlyDeleteTrip
};
