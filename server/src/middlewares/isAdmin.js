const isAdmin = (req, res, next) => {
  if (req.user?.roles.includes('admin')) next();
  else res.status(403).json({ message: 'Access denied. Admins only.' });
};

export default isAdmin;
