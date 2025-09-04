import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = '1h'; // token válido 1 hora

const authService = {

  // Registro de usuario
  async login({ email, password }) {
    // ✅ Buscar solo por string email
    const user = await User.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado');

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    // Generar access token
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generar refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token, refreshToken };
  },


  // Login de usuario
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado.');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Contraseña incorrecta.');

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // Generar refresh token
    const refreshToken = new RefreshToken({
      userId: user._id,
      token: jwt.sign(
        { id: user._id, email: user.email, roles: user.roles },
        JWT_SECRET,
        { expiresIn: '7d' } // opcional, duración más larga que el access token
      ),
      expiresAt: new Date(Date.now() + 7*24*60*60*1000)
    });
    await refreshToken.save();

    return { token, refreshToken: refreshToken.token };
  },

  // Refresh token
  async refreshToken(oldToken) {
    const stored = await RefreshToken.findOne({ token: oldToken });
    if (!stored) throw new Error('Refresh token inválido.');

    const user = await User.findById(stored.userId);
    if (!user) throw new Error('Usuario no encontrado.');

    const token = jwt.sign({ id: user._id, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { token, user };
  },

  // Logout
  async logout(token) {
    await RefreshToken.deleteOne({ token });
  }

};

export default authService;
