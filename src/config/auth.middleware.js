const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Debe estar autenticado para acceder a este recurso' });
};

const ensureRole = (roles) => (req, res, next) => {
    if (roles.includes(req.user.role)) {
        return next();
    }
    res.status(403).json({ error: 'No tiene los permisos necesarios para este recurso' });
};

module.exports = {
    ensureAuthenticated,
    ensureRole
};
