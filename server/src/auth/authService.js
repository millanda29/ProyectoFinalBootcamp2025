import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = '1h'; // token válido 1 hora

const authService = {

  // Registro de usuario
  async register({ email, password, fullName }) {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('El usuario ya existe.');

    // Crear nuevo usuario
    const user = new User({
      email,
      passwordHash: await bcrypt.hash(password, 10),
      fullName,
      roles: ['traveler'] // rol por defecto
    });

    await user.save();

    // Generar tokens
    const token = jwt.sign({ id: user._id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // Generar refresh token como JWT también
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, roles: user.roles },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Guardar refresh token en BD
    const refreshTokenDoc = new RefreshToken({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7*24*60*60*1000)
    });
    await refreshTokenDoc.save();

    return { 
      token, 
      refreshToken
    };
  },


  // Login de usuario
  async login({ email, password }) {

    const user = await User.findOne({ email });

    if (!user) throw new Error('Usuario no encontrado.');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Contraseña incorrecta.');

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // Generar refresh token como JWT también
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, roles: user.roles },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Guardar refresh token en BD
    const refreshTokenDoc = new RefreshToken({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7*24*60*60*1000)
    });
    await refreshTokenDoc.save();

    return { 
      token, 
      refreshToken
    };
  },

  // Refresh token
  async refreshToken(oldToken) {
    const stored = await RefreshToken.findOne({ token: oldToken });
    if (!stored) throw new Error('Refresh token inválido.');

    // Verificar si el refresh token ha expirado
    if (stored.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: stored._id });
      throw new Error('Refresh token expirado.');
    }

    const user = await User.findById(stored.userId);
    if (!user) throw new Error('Usuario no encontrado.');

    // Generar nuevo access token
    const token = jwt.sign({ id: user._id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    // Generar nuevo refresh token como JWT
    const newRefreshToken = jwt.sign(
      { id: user._id, email: user.email, roles: user.roles },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Eliminar el viejo y guardar el nuevo
    await RefreshToken.deleteOne({ _id: stored._id });
    const refreshTokenDoc = new RefreshToken({
      token: newRefreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7*24*60*60*1000)
    });
    await refreshTokenDoc.save();

    return { 
      token, 
      refreshToken: newRefreshToken
    };
  },

  // Logout
  async logout(token) {
    await RefreshToken.deleteOne({ token });
  }

};

export default authService;
