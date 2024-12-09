module.exports = app => {
    const puntoController = require("../controllers/punto.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    // rutas administracion
    router.post('/', authenticateToken, authorizeRole(['administrador', 'verificador']), puntoController.crearPunto);
    router.get('/carretera/:id_carretera', authenticateToken, authorizeRole(['administrador', 'verificador']), puntoController.listarPuntosPorCarretera);
    router.get('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), puntoController.obtenerPuntoPorId);
    router.put('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), puntoController.editarPunto);
    router.delete('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), puntoController.eliminarPunto);

    app.use('/puntos', router);
};
