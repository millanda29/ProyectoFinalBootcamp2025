import User from '../models/User.js';
import Trip from '../models/Trip.js';
import bcrypt from 'bcrypt';

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
    const allowedFields = [
      'fullName', 
      'avatarUrl', 
      'phone', 
      'location', 
      'bio', 
      'website',
      'travelPreferences',
      'notifications'
    ];
    
    const data = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        data[key] = updateData[key];
      }
    }

    // Validaciones específicas
    if (updateData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(updateData.phone)) {
      throw new Error('Formato de teléfono inválido');
    }

    if (updateData.website && !/^https?:\/\/.+/.test(updateData.website)) {
      throw new Error('Formato de URL inválido');
    }

    if (updateData.bio && updateData.bio.length > 500) {
      throw new Error('La biografía no puede exceder los 500 caracteres');
    }

    const user = await User.findByIdAndUpdate(userId, data, { 
      new: true, 
      runValidators: true 
    }).select('-passwordHash');
    
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
  },

  // Actualizar preferencias de viaje
  async updateTravelPreferences(userId, preferences) {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'MXN', 'BRL'];
    const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru'];
    const validStyles = ['budget', 'balanced', 'luxury', 'adventure', 'cultural', 'relaxation', 'business'];

    // Validaciones
    if (preferences.preferredCurrency && !validCurrencies.includes(preferences.preferredCurrency)) {
      throw new Error('Moneda no válida');
    }

    if (preferences.preferredLanguage && !validLanguages.includes(preferences.preferredLanguage)) {
      throw new Error('Idioma no válido');
    }

    if (preferences.travelStyle && !validStyles.includes(preferences.travelStyle)) {
      throw new Error('Estilo de viaje no válido');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { travelPreferences: preferences } },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) throw new Error('Usuario no encontrado.');
    return user;
  },

  // Actualizar configuración de notificaciones
  async updateNotifications(userId, notifications) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { notifications } },
      { new: true }
    ).select('-passwordHash');

    if (!user) throw new Error('Usuario no encontrado.');
    return user;
  },

  // Actualizar estadísticas después de completar un viaje
  async updateUserStats(userId, tripCost, country) {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado.');

    user.stats.tripsCompleted += 1;
    user.stats.totalSpent += tripCost || 0;

    if (country && !user.stats.countriesVisited.includes(country)) {
      user.stats.countriesVisited.push(country);
    }

    await user.save();
    return user.stats;
  },

  // Obtener perfil completo con estadísticas
  async getFullProfile(userId) {
    const user = await User.findById(userId)
      .select('-passwordHash')
      .populate({
        path: 'createdTrips',
        options: { sort: { createdAt: -1 } }
      });

    if (!user) throw new Error('Usuario no encontrado.');

    // Agregar estadísticas calculadas
    const activeTripsCount = await Trip.countDocuments({
      userId,
      status: { $in: ['planned', 'ongoing'] }
    });

    const recentTrip = await Trip.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('title destination startDate');

    return {
      ...user.toObject(),
      computedStats: {
        activeTripsCount,
        recentTrip,
        memberSince: user.memberSince,
        preferredCurrencyName: user.preferredCurrencyName,
        preferredLanguageName: user.preferredLanguageName
      }
    };
  },

  // Buscar usuarios por preferencias similares
  async findUsersByPreferences(userId, preferences = {}) {
    const query = {
      _id: { $ne: userId }, // Excluir al usuario actual
      isActive: true,
      roles: { $in: ['traveler'] }
    };

    if (preferences.favoriteDestination) {
      query['travelPreferences.favoriteDestination'] = {
        $regex: preferences.favoriteDestination,
        $options: 'i'
      };
    }

    if (preferences.travelStyle) {
      query['travelPreferences.travelStyle'] = preferences.travelStyle;
    }

    if (preferences.preferredLanguage) {
      query['travelPreferences.preferredLanguage'] = preferences.preferredLanguage;
    }

    const users = await User.find(query)
      .select('fullName avatarUrl location travelPreferences.favoriteDestination travelPreferences.travelStyle stats.tripsCompleted')
      .limit(10);

    return users;
  },

  // ===== FUNCIONES ADMIN =====

  // Obtener todos los usuarios (solo admin)
  async getAllUsers(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    
    const searchQuery = search ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(searchQuery)
      .select('-passwordHash')
      .populate('createdTrips')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(searchQuery);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // Crear usuario (solo admin)
  async createUser(userData) {
    const { email, password, fullName, roles = ['traveler'] } = userData;
    
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('El email ya está registrado.');
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      passwordHash,
      fullName,
      roles,
      isActive: true
    });

    await newUser.save();
    
    // Retornar sin la contraseña
    return await User.findById(newUser._id).select('-passwordHash');
  },

  // Actualizar usuario (solo admin)
  async updateUserByAdmin(userId, updateData) {
    const allowedFields = ['fullName', 'avatarUrl', 'roles', 'isActive'];
    const data = {};
    
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) data[key] = updateData[key];
    }

    const user = await User.findByIdAndUpdate(
      userId, 
      data, 
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) throw new Error('Usuario no encontrado.');
    return user;
  },

  // Eliminar usuario (solo admin)
  async deleteUser(userId) {
    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado.');

    // Eliminar todos los trips del usuario
    await Trip.deleteMany({ userId });

    // Eliminar el usuario
    await User.findByIdAndDelete(userId);

    return { message: 'Usuario y sus viajes eliminados correctamente.' };
  },

  // Resetear contraseña de usuario (solo admin)
  async resetUserPassword(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado.');

    // Hashear nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    user.passwordHash = passwordHash;
    await user.save();

    return { message: 'Contraseña reseteada correctamente.' };
  },

  // Obtener estadísticas de usuarios (solo admin)
  async getUserStats() {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ roles: 'admin' });
    const travelerUsers = await User.countDocuments({ roles: 'traveler' });
    
    const totalTrips = await Trip.countDocuments();
    const recentUsers = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      travelerUsers,
      totalTrips,
      recentUsers
    };
  },

  // Programar eliminación de cuenta (31 días)
  async scheduleAccountDeletion(userId, reason = 'Usuario solicitó eliminación') {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.deletionScheduled?.isScheduled) {
      throw new Error('Ya hay una eliminación programada para esta cuenta');
    }

    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 31); // 31 días desde ahora

    await User.findByIdAndUpdate(userId, {
      'deletionScheduled.isScheduled': true,
      'deletionScheduled.scheduledDate': scheduledDate,
      'deletionScheduled.requestedAt': new Date(),
      'deletionScheduled.reason': reason
    });

    return {
      scheduledDate,
      daysRemaining: 31
    };
  },

  // Cancelar eliminación programada
  async cancelAccountDeletion(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.deletionScheduled?.isScheduled) {
      throw new Error('No hay ninguna eliminación programada para esta cuenta');
    }

    await User.findByIdAndUpdate(userId, {
      'deletionScheduled.isScheduled': false,
      'deletionScheduled.scheduledDate': null,
      'deletionScheduled.requestedAt': null,
      'deletionScheduled.reason': null
    });
  },

  // Eliminar mi cuenta inmediatamente
  async deleteMyAccount(userId, password) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Eliminar todos los viajes del usuario
    await Trip.deleteMany({ userId });

    // TODO: Aquí también deberíamos limpiar PDFs asociados
    
    // Eliminar usuario
    await User.findByIdAndDelete(userId);

    // TODO: Invalidar todos los tokens del usuario
  },

  // Función para procesar eliminaciones programadas (para ejecutar diariamente)
  async processScheduledDeletions() {
    const now = new Date();
    const usersToDelete = await User.find({
      'deletionScheduled.isScheduled': true,
      'deletionScheduled.scheduledDate': { $lte: now }
    });

    const deletedUsers = [];
    for (const user of usersToDelete) {
      try {
        // Eliminar viajes del usuario
        await Trip.deleteMany({ userId: user._id });
        
        // Eliminar usuario
        await User.findByIdAndDelete(user._id);
        
        deletedUsers.push({
          id: user._id,
          email: user.email,
          scheduledDate: user.deletionScheduled.scheduledDate
        });
      } catch (error) {
        console.error(`Error eliminando usuario ${user._id}:`, error);
      }
    }

    return deletedUsers;
  }

};

export default userService;
