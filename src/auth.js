function Auth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send("Acceso no autorizado. Debes iniciar sesión.");
    } else {
        next();
    }
}

module.exports = Auth;

