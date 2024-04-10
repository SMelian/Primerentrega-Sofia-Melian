// Middleware de autenticación
function Auth(req, res, next) {
    // Verifica si el usuario está autenticado
    if (!req.session.user) {
        // Si el usuario no está autenticado, redirigir o enviar un mensaje de error
        return res.status(401).send("Acceso no autorizado. Debes iniciar sesión.");
    } else {
        // Si el usuario está autenticado, continuar con la solicitud
        next();
    }
}

module.exports = Auth;
