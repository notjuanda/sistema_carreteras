const jwt = require('jsonwebtoken');

module.exports = {
    authenticateToken(req, res, next) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ msg: 'Token no proporcionado.' });
        }

        try {
            const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY);
            req.usuario = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ msg: 'Token inválido o expirado.' });
        }
    },

    authorizeRole(roles) {
        return (req, res, next) => {
            const { tipo } = req.usuario;

            if (!roles.includes(tipo)) {
                return res.status(403).json({ msg: 'No tienes permisos para esta acción.' });
            }

            next();
        };
    }
};
