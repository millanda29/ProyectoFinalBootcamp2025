import authService from './authService.js';

const authController = {

  // Registro de usuario
  register: async (req, res, next) => {
    try {
      const { token, refreshToken, user } = await authService.register(req.body);
      res.status(201).json({
        success: true,
        token,
        refreshToken,
        user
      });
    } catch (err) {
      next(err);
    }
  },

  // Login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { user, token, refreshToken } = await authService.login({ email, password });

      res.json({ 
        success: true,
        user, 
        token, 
        refreshToken 
      });
    } catch (err) {
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

      const { token, refreshToken: newRefreshToken, user } = await authService.refreshToken(refreshToken);
      res.json({ 
        success: true,
        token, 
        refreshToken: newRefreshToken, 
        user 
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
  }

};

export default authController;
