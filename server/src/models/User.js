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
  avatarUrl: { type: String, default: 'https://cdn/avatars/default.png' },
  roles: { type: [String], default: ['traveler'] },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  createdTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
}, { timestamps: true });

// Virtual para contar viajes activos
userSchema.virtual('activeTrips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'userId',
  match: { status: { $in: ['planned','ongoing'] } }
});

export default mongoose.model('User', userSchema);
