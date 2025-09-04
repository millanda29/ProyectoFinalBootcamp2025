import User from '../models/User.js';
import Trip from '../models/Trip.js';

const userService = {

  // Obtener perfil de usuario por ID
  async getProfile(userId) {
    const user = await User.findById(userId)
      .select('-passwordHash')
      .populate('createdTrips');
    if (!user) throw new Error('Usuario no encontrado.');
    return user;
  },

  // Editar perfil
  async updateProfile(userId, updateData) {
    const allowedFields = ['fullName','avatarUrl','roles','isActive'];
    const data = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) data[key] = updateData[key];
    }
    const user = await User.findByIdAndUpdate(userId, data, { new: true }).select('-passwordHash');
    if (!user) throw new Error('Usuario no encontrado.');
    return user;
  },

  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado.');

    // Verificar contraseña actual
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new Error('Contraseña actual incorrecta.');

    // Hashear nueva contraseña y guardar
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Contraseña actualizada correctamente.' };
  },

  // Historial de viajes
  async getTravelHistory(userId) {
    const trips = await Trip.find({ userId }).sort({ startDate: -1 });
    return trips;
  }

};

export default userService;
