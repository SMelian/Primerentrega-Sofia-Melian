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

const User = require('../dao/models/User.modelo');

const updateLastConnection = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        await User.findByIdAndUpdate(userId, { last_connection: new Date() });
        next();
    } catch (error) {
        res.status(500).send('Error al actualizar la última conexión');
    }
};

module.exports = {
    ensureAuthenticated,
    ensureRole,
    updateLastConnection
};
