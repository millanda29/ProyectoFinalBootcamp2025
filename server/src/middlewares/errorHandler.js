const errorHandler = (err, req, res, next) => {
  // Determinar status code
  let statusCode = err.status || 500;

  // Mensaje por defecto
  let message = err.message || 'Internal Server Error';

  // Código de error opcional
  let code = err.code || 'SERVER_ERROR';

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Errores de clave única (duplicated key)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    code = 'DUPLICATE_KEY';
    const field = Object.keys(err.keyValue);
    message = `El valor de ${field} ya existe`;
  }

  // Errores JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Token expirado';
  }

  // Log del error solo en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    code,
    message
  });
};

export default errorHandler;
