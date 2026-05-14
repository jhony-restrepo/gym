const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Formato: Bearer TOKEN
    if (!token) return res.status(403).json({ mensaje: "Token no proporcionado" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos los datos del usuario en la petición
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
};

exports.checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ mensaje: "No tienes permiso para esta acción" });
        }
        next();
    };
};