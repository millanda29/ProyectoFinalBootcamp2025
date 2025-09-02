module.exports = (req, res, next) => {
    if (req.user && req.user.roles && req.user.roles.includes('admin')) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};