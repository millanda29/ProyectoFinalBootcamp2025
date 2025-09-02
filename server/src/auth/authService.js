import User from '../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

const authService = {
    register: async ({ email, password, fullName }) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            passwordHash,
            fullName,
            roles: ['traveler'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newUser.save();
        return newUser;
    },

    login: async (email, password) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = generateToken(user._id);
        return { user, token };
    }
};

export default authService;