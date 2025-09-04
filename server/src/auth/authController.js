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

  // Login de usuario
  login: async (req, res, next) => {
    try {
      // ✅ Extraer los campos directamente
      const { email, password } = req.body;

      const { user, token, refreshToken } = await authService.login({ email, password });

      res.json({ user, token, refreshToken });
    } catch (err) {
      next(err);
    }
  },

  // Refresh token
  refresh: async (req, res, next) => {
    try {
      const { token, user } = await authService.refreshToken(req.body.refreshToken);
      res.json({ token, user });
    } catch (err) {
      next(err);
    }
  },

  // Logout
  logout: async (req, res, next) => {
    try {
      await authService.logout(req.body.refreshToken);
      res.json({ message: 'Logout exitoso' });
    } catch (err) {
      next(err);
    }
  }

};

export default authController;
