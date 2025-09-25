import express from 'express';
import tripController from '../controllers/tripController.js';
import { authenticateJWT } from '../auth/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Endpoints para gestión de viajes
 */

/**
 * @swagger
 * /api/trips/my:
 *   get:
 *     summary: Obtener mis viajes
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, ongoing, completed]
 *         description: Filtrar por estado del viaje
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista de viajes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trips:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *                 totalPages:
 *                   type: number
 *                 currentPage:
 *                   type: number
 *                 totalTrips:
 *                   type: number
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my', authenticateJWT, tripController.getMyTrips);

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Crear un nuevo viaje
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - destination
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del viaje
 *               destination:
 *                 type: string
 *                 description: Destino del viaje
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio (YYYY-MM-DD)
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin (YYYY-MM-DD)
 *               partySize:
 *                 type: number
 *                 minimum: 1
 *                 description: Número de personas
 *               status:
 *                 type: string
 *                 enum: [planned, ongoing, completed]
 *                 description: Estado del viaje
 *           example:
 *             title: "Vacaciones en París"
 *             destination: "París, Francia"
 *             startDate: "2024-06-15"
 *             endDate: "2024-06-22"
 *             partySize: 2
 *             status: "planned"
 *     responses:
 *       201:
 *         description: Viaje creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateJWT, tripController.createTrip);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Obtener viaje por ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *     responses:
 *       200:
 *         description: Información del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticateJWT, tripController.getTripById);

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Actualizar viaje
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               destination:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               partySize:
 *                 type: number
 *                 minimum: 1
 *               status:
 *                 type: string
 *                 enum: [planned, ongoing, completed]
 *           example:
 *             title: "Vacaciones en París - Actualizado"
 *             destination: "París, Francia"
 *             startDate: "2024-06-16"
 *             endDate: "2024-06-23"
 *             partySize: 3
 *             status: "ongoing"
 *     responses:
 *       200:
 *         description: Viaje actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticateJWT, tripController.updateTrip);

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Eliminar viaje (eliminación lógica)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *     responses:
 *       200:
 *         description: Viaje eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Viaje eliminado exitosamente"
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateJWT, tripController.deleteTrip);

/**
 * @swagger
 * /api/trips/{id}/costs:
 *   put:
 *     summary: Agregar/actualizar costos del viaje
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               costs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                     - label
 *                     - amount
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [lodging, transport, activity, other]
 *                     label:
 *                       type: string
 *                     currency:
 *                       type: string
 *                       default: "USD"
 *                     amount:
 *                       type: number
 *                       minimum: 0
 *                     quantity:
 *                       type: number
 *                       minimum: 0
 *                       default: 1
 *           example:
 *             costs:
 *               - type: "lodging"
 *                 label: "Hotel París"
 *                 currency: "EUR"
 *                 amount: 120
 *                 quantity: 7
 *               - type: "transport"
 *                 label: "Vuelo Madrid-París"
 *                 currency: "EUR"
 *                 amount: 200
 *                 quantity: 2
 *     responses:
 *       200:
 *         description: Costos actualizados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/costs', authenticateJWT, tripController.addCosts);

/**
 * @swagger
 * /api/trips/{id}/itinerary:
 *   put:
 *     summary: Actualizar itinerario del viaje
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itinerary:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - dayNumber
 *                   properties:
 *                     dayNumber:
 *                       type: number
 *                     notes:
 *                       type: string
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           category:
 *                             type: string
 *                           startTime:
 *                             type: string
 *                           endTime:
 *                             type: string
 *                           location:
 *                             type: string
 *                           externalRef:
 *                             type: string
 *           example:
 *             itinerary:
 *               - dayNumber: 1
 *                 notes: "Llegada a París"
 *                 activities:
 *                   - title: "Check-in hotel"
 *                     category: "accommodation"
 *                     startTime: "15:00"
 *                     endTime: "16:00"
 *                     location: "Hotel París Centro"
 *                   - title: "Cena en restaurante local"
 *                     category: "dining"
 *                     startTime: "20:00"
 *                     endTime: "22:00"
 *                     location: "Le Petit Bistro"
 *     responses:
 *       200:
 *         description: Itinerario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/itinerary', authenticateJWT, tripController.updateItinerary);

/**
 * @swagger
 * /api/trips/{id}/report:
 *   post:
 *     summary: Generar reporte PDF del viaje
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [pdf]
 *                 default: "pdf"
 *               includeItinerary:
 *                 type: boolean
 *                 default: true
 *               includeCosts:
 *                 type: boolean
 *                 default: true
 *           example:
 *             format: "pdf"
 *             includeItinerary: true
 *             includeCosts: true
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reporte generado exitosamente"
 *                 reportUrl:
 *                   type: string
 *                   example: "/reports/trip-12345-report.pdf"
 *                 reportId:
 *                   type: string
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/report', authenticateJWT, tripController.generateReport);

/**
 * @swagger
 * /api/trips/{id}/reports:
 *   get:
 *     summary: Obtener lista de reportes del viaje
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *     responses:
 *       200:
 *         description: Lista de reportes del viaje
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fileUrl:
 *                     type: string
 *                   format:
 *                     type: string
 *                   generatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/reports', authenticateJWT, tripController.getTripReports);

/**
 * @swagger
 * /api/trips/{id}/pdf:
 *   get:
 *     summary: Descargar PDF del viaje
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *       - in: query
 *         name: reportId
 *         schema:
 *           type: string
 *         description: ID específico del reporte (opcional, usa el más reciente si no se especifica)
 *     responses:
 *       200:
 *         description: Archivo PDF del viaje
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje o reporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/pdf', authenticateJWT, tripController.servePDF);

/**
 * @swagger
 * tags:
 *   name: Trips - Admin
 *   description: Endpoints de administración de viajes (solo administradores)
 */

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Obtener todos los viajes (Admin)
 *     tags: [Trips - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, ongoing, completed]
 *         description: Filtrar por estado
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrar por ID de usuario
 *     responses:
 *       200:
 *         description: Lista de todos los viajes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trips:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *                 totalPages:
 *                   type: number
 *                 currentPage:
 *                   type: number
 *                 totalTrips:
 *                   type: number
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateJWT, isAdmin, tripController.getAllTrips);

/**
 * @swagger
 * /api/trips/deleted:
 *   get:
 *     summary: Obtener viajes eliminados (Admin)
 *     tags: [Trips - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista de viajes eliminados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trips:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *                 totalPages:
 *                   type: number
 *                 currentPage:
 *                   type: number
 *                 totalTrips:
 *                   type: number
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/deleted', authenticateJWT, isAdmin, tripController.getDeletedTrips);

/**
 * @swagger
 * /api/trips/{id}/restore:
 *   post:
 *     summary: Restaurar viaje eliminado (Admin)
 *     tags: [Trips - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje eliminado
 *     responses:
 *       200:
 *         description: Viaje restaurado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Viaje restaurado exitosamente"
 *                 trip:
 *                   $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/restore', authenticateJWT, isAdmin, tripController.restoreTrip);

/**
 * @swagger
 * /api/trips/{id}/permanent:
 *   delete:
 *     summary: Eliminar viaje permanentemente (Admin)
 *     tags: [Trips - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje a eliminar permanentemente
 *     responses:
 *       200:
 *         description: Viaje eliminado permanentemente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Viaje eliminado permanentemente"
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id/permanent', authenticateJWT, isAdmin, tripController.permanentlyDeleteTrip);

/**
 * @swagger
 * /api/trips/cleanup/orphaned-pdfs:
 *   delete:
 *     summary: Limpiar PDFs huérfanos (Admin)
 *     tags: [Trips - Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Elimina archivos PDF que no están asociados a ningún viaje activo
 *     responses:
 *       200:
 *         description: Limpieza completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Limpieza de PDFs completada"
 *                 deletedFiles:
 *                   type: number
 *                   description: Número de archivos eliminados
 *                 freedSpace:
 *                   type: string
 *                   description: Espacio liberado
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/cleanup/orphaned-pdfs', authenticateJWT, isAdmin, tripController.cleanupOrphanedPDFs);

export default router;