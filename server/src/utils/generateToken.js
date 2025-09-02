import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
        { id: user._id, email: user.email, roles: user.roles },
        secretKey,
        { expiresIn: '1h' }
    );
    return token;
};

export default generateToken;