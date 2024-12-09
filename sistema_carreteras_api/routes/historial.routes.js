module.exports = app => {
    const historialController = require("../controllers/historial.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    // rutas admninistracion
    router.get('/', authenticateToken, authorizeRole(['administrador']), historialController.obtenerHistorial);
    router.get('/cambios', authenticateToken, authorizeRole(['administrador']), historialController.obtenerUsuariosPorCambio);

    app.use('/historial', router);
};
