const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};
