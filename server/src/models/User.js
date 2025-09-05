import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /.+\@.+\..+/ // valida formato de email
  },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true, trim: true },
  
  // Información personal extendida
  phone: { 
    type: String, 
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v); // formato internacional opcional
      },
      message: 'Formato de teléfono inválido'
    }
  },
  location: { type: String, trim: true }, // Ciudad, País
  bio: { 
    type: String, 
    maxlength: 500,
    trim: true 
  },
  website: { 
    type: String, 
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v); // URL válida opcional
      },
      message: 'Formato de URL inválido'
    }
  },
  
  // Configuración de perfil
  avatarUrl: { type: String, default: 'https://cdn/avatars/default.png' },
  roles: { type: [String], default: ['traveler'] },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  
  // Preferencias de viaje
  travelPreferences: {
    preferredCurrency: { 
      type: String, 
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'MXN', 'BRL']
    },
    preferredLanguage: { 
      type: String, 
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru']
    },
    travelStyle: { 
      type: String, 
      default: 'balanced',
      enum: ['budget', 'balanced', 'luxury', 'adventure', 'cultural', 'relaxation', 'business']
    },
    favoriteDestination: { type: String, trim: true },
    budgetRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'USD' }
    },
    accommodationPreference: {
      type: String,
      enum: ['hotel', 'hostel', 'airbnb', 'resort', 'camping', 'any'],
      default: 'any'
    },
    transportPreference: {
      type: String,
      enum: ['flight', 'train', 'bus', 'car', 'any'],
      default: 'any'
    }
  },
  
  // Configuración de notificaciones
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    tripReminders: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false }
  },
  
  // Relaciones
  createdTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
  
  // Estadísticas del usuario
  stats: {
    tripsCompleted: { type: Number, default: 0 },
    countriesVisited: [{ type: String }],
    totalSpent: { type: Number, default: 0 },
    totalSaved: { type: Number, default: 0 }
  },
  
  // Campos para eliminación programada
  deletionScheduled: {
    isScheduled: { type: Boolean, default: false },
    scheduledDate: { type: Date },
    requestedAt: { type: Date },
    reason: { type: String, trim: true }
  }
  
}, { timestamps: true });

// Índices para optimizar búsquedas
userSchema.index({ email: 1 });
userSchema.index({ fullName: 'text', location: 'text' }); // búsqueda de texto
userSchema.index({ 'travelPreferences.favoriteDestination': 1 });
userSchema.index({ isActive: 1, roles: 1 });

// Virtual para contar viajes activos
userSchema.virtual('activeTrips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'userId',
  match: { status: { $in: ['planned','ongoing'] } }
});

// Virtual para obtener la fecha de registro en formato legible
userSchema.virtual('memberSince').get(function() {
  return this.createdAt ? this.createdAt.toLocaleDateString('es-ES') : null;
});

// Virtual para obtener el nombre de la moneda preferida
userSchema.virtual('preferredCurrencyName').get(function() {
  const currencies = {
    'USD': 'Dólar Estadounidense',
    'EUR': 'Euro',
    'GBP': 'Libra Esterlina',
    'JPY': 'Yen Japonés',
    'CAD': 'Dólar Canadiense',
    'AUD': 'Dólar Australiano',
    'CHF': 'Franco Suizo',
    'CNY': 'Yuan Chino',
    'MXN': 'Peso Mexicano',
    'BRL': 'Real Brasileño'
  };
  return currencies[this.travelPreferences?.preferredCurrency] || 'Dólar Estadounidense';
});

// Virtual para obtener el nombre del idioma preferido
userSchema.virtual('preferredLanguageName').get(function() {
  const languages = {
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'pt': 'Português',
    'ja': '日本語',
    'ko': '한국어',
    'zh': '中文',
    'ru': 'Русский'
  };
  return languages[this.travelPreferences?.preferredLanguage] || 'English';
});

// Método para actualizar estadísticas después de completar un viaje
userSchema.methods.updateTripStats = function(tripCost, country) {
  this.stats.tripsCompleted += 1;
  this.stats.totalSpent += tripCost || 0;
  
  if (country && !this.stats.countriesVisited.includes(country)) {
    this.stats.countriesVisited.push(country);
  }
  
  return this.save();
};

// Middleware para actualizar lastLogin automáticamente
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Configurar virtuals para que se incluyan en JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.model('User', userSchema);
