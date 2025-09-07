import authService from './authService.js';

const authController = {

  // Registro de usuario
  register: async (req, res, next) => {
    try {
      const { token, refreshToken } = await authService.register(req.body);
      res.status(201).json({
        token,
        refreshToken
      });
    } catch (err) {
      next(err);
    }
  },

  // Login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      const { token, refreshToken } = await authService.login({ email, password });

      res.json({ 
        token, 
        refreshToken
      });
    } catch (err) {
      console.log('Login error:', err.message);
      next(err);
    }
  },

  // Refresh token
  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token es requerido'
        });
      }

      const { token, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);
      res.json({ 
        token, 
        refreshToken: newRefreshToken
      });
    } catch (err) {
      next(err);
    }
  },

  // Logout
  logout: async (req, res, next) => {
    try {
      await authService.logout(req.body.refreshToken);
      res.json({ 
        success: true,
        message: 'Logout exitoso' 
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
          message: 'Contraseña actual y nueva contraseña son requeridas'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      await authService.changePassword(req.user.id, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (err) {
      next(err);
    }
  }

};

export default authController;
