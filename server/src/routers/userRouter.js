import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateJWT } from '../auth/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', authenticateJWT, userController.getProfile);

/**
 * @swagger
 * /api/users/me/full:
 *   get:
 *     summary: Obtener perfil completo del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil completo del usuario incluyendo estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me/full', authenticateJWT, userController.getFullProfile);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Nombre completo
 *               phone:
 *                 type: string
 *                 description: Teléfono
 *               location:
 *                 type: string
 *                 description: Ubicación
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 description: Biografía
 *               website:
 *                 type: string
 *                 format: uri
 *                 description: Sitio web
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL del avatar
 *           example:
 *             fullName: "Juan Pérez Actualizado"
 *             phone: "+1234567890"
 *             location: "Madrid, España"
 *             bio: "Amante de los viajes y la aventura"
 *             website: "https://miwebsite.com"
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
router.put('/me', authenticateJWT, userController.updateProfile);

/**
 * @swagger
 * /api/users/me/trips:
 *   get:
 *     summary: Obtener historial de viajes del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de viajes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me/trips', authenticateJWT, userController.getTravelHistory);

/**
 * @swagger
 * /api/users/me/change-password:
 *   put:
 *     summary: Cambiar contraseña del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: Nueva contraseña
 *           example:
 *             currentPassword: "passwordActual123"
 *             newPassword: "nuevaPassword456"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Contraseña actual incorrecta
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
router.put('/me/change-password', authenticateJWT, userController.changePassword);

/**
 * @swagger
 * /api/users/me/schedule-deletion:
 *   post:
 *     summary: Programar eliminación de cuenta
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Eliminación de cuenta programada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Eliminación de cuenta programada"
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/me/schedule-deletion', authenticateJWT, userController.requestAccountDeletion);

/**
 * @swagger
 * /api/users/me/cancel-deletion:
 *   delete:
 *     summary: Cancelar eliminación programada de cuenta
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Eliminación de cuenta cancelada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Eliminación de cuenta cancelada"
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/me/cancel-deletion', authenticateJWT, userController.cancelAccountDeletion);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Eliminar mi cuenta inmediatamente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cuenta eliminada exitosamente"
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/me', authenticateJWT, userController.deleteMyAccount);

/**
 * @swagger
 * /api/users/me/preferences:
 *   put:
 *     summary: Actualizar preferencias de viaje
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferredCurrency:
 *                 type: string
 *                 enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'MXN', 'BRL']
 *               preferredLanguage:
 *                 type: string
 *                 enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru']
 *               travelStyle:
 *                 type: string
 *                 enum: ['budget', 'balanced', 'luxury', 'adventure', 'cultural', 'relaxation', 'business']
 *               favoriteDestination:
 *                 type: string
 *               budgetRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *               accommodationPreference:
 *                 type: string
 *                 enum: ['hotel', 'hostel', 'airbnb', 'resort', 'camping', 'any']
 *               transportPreference:
 *                 type: string
 *                 enum: ['flight', 'train', 'bus', 'car', 'any']
 *           example:
 *             preferredCurrency: "EUR"
 *             preferredLanguage: "es"
 *             travelStyle: "adventure"
 *             favoriteDestination: "Japan"
 *             budgetRange:
 *               min: 1000
 *               max: 5000
 *               currency: "EUR"
 *             accommodationPreference: "hotel"
 *             transportPreference: "flight"
 *     responses:
 *       200:
 *         description: Preferencias actualizadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/me/preferences', authenticateJWT, userController.updateTravelPreferences);

/**
 * @swagger
 * /api/users/me/notifications:
 *   put:
 *     summary: Actualizar configuración de notificaciones
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *                 description: Recibir notificaciones por email
 *               push:
 *                 type: boolean
 *                 description: Recibir notificaciones push
 *               tripReminders:
 *                 type: boolean
 *                 description: Recibir recordatorios de viajes
 *               promotions:
 *                 type: boolean
 *                 description: Recibir promociones
 *           example:
 *             email: true
 *             push: false
 *             tripReminders: true
 *             promotions: false
 *     responses:
 *       200:
 *         description: Notificaciones actualizadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/me/notifications', authenticateJWT, userController.updateNotifications);

/**
 * @swagger
 * /api/users/me/stats:
 *   put:
 *     summary: Actualizar estadísticas del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripsCompleted:
 *                 type: number
 *                 description: Número de viajes completados
 *               countriesVisited:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de países visitados
 *               totalSpent:
 *                 type: number
 *                 description: Total gastado en viajes
 *           example:
 *             tripsCompleted: 5
 *             countriesVisited: ["España", "Francia", "Italia"]
 *             totalSpent: 15000
 *     responses:
 *       200:
 *         description: Estadísticas actualizadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/me/stats', authenticateJWT, userController.updateStats);

/**
 * @swagger
 * /api/users/similar:
 *   get:
 *     summary: Encontrar usuarios con preferencias similares
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios similares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/similar', authenticateJWT, userController.findSimilarUsers);

/**
 * @swagger
 * tags:
 *   name: Users - Admin
 *   description: Endpoints de administración de usuarios (solo administradores)
 */

/**
 * @swagger
 * /api/users/admin/stats:
 *   get:
 *     summary: Obtener estadísticas generales de usuarios (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                 activeUsers:
 *                   type: number
 *                 deletedUsers:
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
router.get('/admin/stats', authenticateJWT, isAdmin, userController.getStats);

/**
 * @swagger
 * /api/users/admin/all:
 *   get:
 *     summary: Obtener todos los usuarios (Admin)
 *     tags: [Users - Admin]
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
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 totalPages:
 *                   type: number
 *                 currentPage:
 *                   type: number
 *                 totalUsers:
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
router.get('/admin/all', authenticateJWT, isAdmin, userController.getAllUsers);

/**
 * @swagger
 * /api/users/admin/create:
 *   post:
 *     summary: Crear nuevo usuario (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             email: "nuevousuario@ejemplo.com"
 *             password: "password123"
 *             fullName: "Nuevo Usuario"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *         description: Acceso denegado - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El email ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/admin/create', authenticateJWT, isAdmin, userController.createUser);

/**
 * @swagger
 * /api/users/admin/{id}:
 *   get:
 *     summary: Obtener usuario por ID (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/admin/:id', authenticateJWT, isAdmin, userController.getUserById);

/**
 * @swagger
 * /api/users/admin/{id}:
 *   put:
 *     summary: Actualizar usuario por ID (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *           example:
 *             fullName: "Usuario Actualizado"
 *             email: "actualizado@ejemplo.com"
 *             roles: ["traveler", "admin"]
 *             isActive: true
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *         description: Acceso denegado - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/admin/:id', authenticateJWT, isAdmin, userController.updateUser);

/**
 * @swagger
 * /api/users/admin/{id}:
 *   delete:
 *     summary: Eliminar usuario (eliminación lógica) (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado exitosamente"
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
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/admin/:id', authenticateJWT, isAdmin, userController.deleteUser);

/**
 * @swagger
 * /api/users/admin/{id}/reset-password:
 *   put:
 *     summary: Resetear contraseña de usuario (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: Nueva contraseña para el usuario
 *           example:
 *             newPassword: "nuevaPassword123"
 *     responses:
 *       200:
 *         description: Contraseña reseteada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña reseteada exitosamente"
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
 *         description: Acceso denegado - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/admin/:id/reset-password', authenticateJWT, isAdmin, userController.resetPassword);

/**
 * @swagger
 * /api/users/admin/deleted:
 *   get:
 *     summary: Obtener usuarios eliminados (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios eliminados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
router.get('/admin/deleted', authenticateJWT, isAdmin, userController.getDeletedUsers);

/**
 * @swagger
 * /api/users/admin/{id}/restore:
 *   post:
 *     summary: Restaurar usuario eliminado (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario eliminado
 *     responses:
 *       200:
 *         description: Usuario restaurado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario restaurado exitosamente"
 *                 user:
 *                   $ref: '#/components/schemas/User'
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
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/admin/:id/restore', authenticateJWT, isAdmin, userController.restoreUser);

/**
 * @swagger
 * /api/users/admin/{id}/permanent:
 *   delete:
 *     summary: Eliminar usuario permanentemente (Admin)
 *     tags: [Users - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar permanentemente
 *     responses:
 *       200:
 *         description: Usuario eliminado permanentemente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado permanentemente"
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
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/admin/:id/permanent', authenticateJWT, isAdmin, userController.permanentlyDeleteUser);

export default router;
