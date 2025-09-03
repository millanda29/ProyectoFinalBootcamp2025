import User from '../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

const userService = {
  async registerUser({ email, password, fullName }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash, fullName, roles: ['traveler'], isActive: true });
    await newUser.save();
    return newUser;
  },

  async authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = generateToken(user);
    return { user, token };
  },

  async getAllUsers() {
    return await User.find().select('-passwordHash');
  },

  async getUserById(userId) {
    return await User.findById(userId).select('-passwordHash');
  },

  async updateUser(userId, updatedData) {
    return await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-passwordHash');
  },
};

export default userService;
