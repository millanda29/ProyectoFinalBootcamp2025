import userService from '../services/userService.js';

const userController = {

  // Obtener perfil del usuario
  getProfile: async (req, res, next) => {
    try {
      const user = await userService.getProfile(req.user.id);
      res.json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  // Editar perfil
  updateProfile: async (req, res, next) => {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        data: user,
        message: 'Perfil actualizado correctamente'
      });
    } catch (err) {
      next(err);
    }
  },

  // Historial de viajes
  getTravelHistory: async (req, res, next) => {
    try {
      const trips = await userService.getTravelHistory(req.user.id);
      res.json({
        success: true,
        data: trips,
        count: trips.length
      });
    } catch (err) {
      next(err);
    }
  },

  // Cambiar contraseña
  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'currentPassword y newPassword son requeridos'
        });
      }

      const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
      res.json({
        success: true,
        message: result.message
      });
    } catch (err) {
      next(err);
    }
  },

  // Obtener perfil completo con estadísticas
  getFullProfile: async (req, res, next) => {
    try {
      const fullProfile = await userService.getFullProfile(req.user.id);
      res.json({
        success: true,
        data: fullProfile
      });
    } catch (err) {
      next(err);
    }
  },

  // Actualizar preferencias de viaje
  updateTravelPreferences: async (req, res, next) => {
    try {
      const user = await userService.updateTravelPreferences(req.user.id, req.body);
      res.json({
        success: true,
        data: user.travelPreferences,
        message: 'Preferencias de viaje actualizadas correctamente'
      });
    } catch (err) {
      next(err);
    }
  },

  // Actualizar configuración de notificaciones
  updateNotifications: async (req, res, next) => {
    try {
      const user = await userService.updateNotifications(req.user.id, req.body);
      res.json({
        success: true,
        data: user.notifications,
        message: 'Configuración de notificaciones actualizada correctamente'
      });
    } catch (err) {
      next(err);
    }
  },

  // Buscar usuarios con preferencias similares
  findSimilarUsers: async (req, res, next) => {
    try {
      const users = await userService.findUsersByPreferences(req.user.id, req.query);
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (err) {
      next(err);
    }
  },

  // Actualizar estadísticas de usuario (para uso interno después de completar viajes)
  updateStats: async (req, res, next) => {
    try {
      const { tripCost, country } = req.body;
      const stats = await userService.updateUserStats(req.user.id, tripCost, country);
      res.json({
        success: true,
        data: stats,
        message: 'Estadísticas actualizadas correctamente'
      });
    } catch (err) {
      next(err);
    }
  },

  // ===== FUNCIONES ADMIN =====

  // Obtener todos los usuarios (solo admin)
  getAllUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const result = await userService.getAllUsers(parseInt(page), parseInt(limit), search);
      
      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  },

  // Crear usuario (solo admin)
  createUser: async (req, res, next) => {
    try {
      const { email, password, fullName, roles } = req.body;
      
      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'email, password y fullName son requeridos'
        });
      }

      const newUser = await userService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'Usuario creado correctamente'
      });
    } catch (err) {
      next(err);
    }
  },

  // Obtener usuario por ID (solo admin)
  getUserById: async (req, res, next) => {
    try {
      const user = await userService.getProfile(req.params.id);
      res.json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  // Actualizar usuario (solo admin)
  updateUser: async (req, res, next) => {
    try {
      const user = await userService.updateUserByAdmin(req.params.id, req.body);
      res.json({
        success: true,
        data: user,
        message: 'Usuario actualizado correctamente'
      });
    } catch (err) {
      next(err);
    }
  },

  // Eliminar usuario (solo admin)
  deleteUser: async (req, res, next) => {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (err) {
      next(err);
    }
  },

  // Resetear contraseña (solo admin)
  resetPassword: async (req, res, next) => {
    try {
      const { newPassword } = req.body;
      
      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: 'newPassword es requerido'
        });
      }

      const result = await userService.resetUserPassword(req.params.id, newPassword);
      res.json({
        success: true,
        message: result.message
      });
    } catch (err) {
      next(err);
    }
  },

  // Obtener estadísticas (solo admin)
  getStats: async (req, res, next) => {
    try {
      const stats = await userService.getUserStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  },

  // Solicitar eliminación de cuenta (31 días)
  requestAccountDeletion: async (req, res, next) => {
    try {
      const { reason } = req.body;
      const result = await userService.scheduleAccountDeletion(req.user.id, reason);
      
      res.json({
        success: true,
        message: 'Solicitud de eliminación programada exitosamente',
        data: {
          scheduledDate: result.scheduledDate,
          daysRemaining: result.daysRemaining
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // Cancelar eliminación programada
  cancelAccountDeletion: async (req, res, next) => {
    try {
      await userService.cancelAccountDeletion(req.user.id);
      
      res.json({
        success: true,
        message: 'Eliminación de cuenta cancelada exitosamente'
      });
    } catch (err) {
      next(err);
    }
  },

  // Eliminar cuenta inmediatamente (solo el propio usuario)
  deleteMyAccount: async (req, res, next) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña es requerida para confirmar eliminación'
        });
      }

      await userService.deleteMyAccount(req.user.id, password);
      
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

};

export default userController;
