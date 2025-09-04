import userService from '../services/userService.js';

const userController = {

  // Obtener perfil del usuario
  getProfile: async (req, res, next) => {
    try {
      const user = await userService.getProfile(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  // Editar perfil
  updateProfile: async (req, res, next) => {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  // Historial de viajes
  getTravelHistory: async (req, res, next) => {
    try {
      const trips = await userService.getTravelHistory(req.user.id);
      res.json(trips);
    } catch (err) {
      next(err);
    }
  },

  // Cambiar contraseña
  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

};

export default userController;
