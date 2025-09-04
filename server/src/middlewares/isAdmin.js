const isAdmin = (req, res, next) => {
  try {
    // Verificar que req.user existe y roles es un array
    if (!req.user || !Array.isArray(req.user.roles)) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Usuario no autenticado'
      });
    }

    // Verificar rol admin
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'Access denied. Admins only.'
      });
    }

    // Usuario es admin, continuar
    next();
  } catch (err) {
    next(err); // enviar al errorHandler
  }
};

export default isAdmin;
