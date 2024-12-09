module.exports = app => {
    const carreteraController = require("../controllers/carretera.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    // acceso público
    router.get('/public', carreteraController.getPublicCarreteras);
    router.get('/public/:id', carreteraController.getPublicCarreteraById);

    // Rutas administración
    router.post('/', authenticateToken, authorizeRole(['administrador', 'verificador']), carreteraController.createCarretera);
    router.get('/', authenticateToken, authorizeRole(['administrador', 'verificador']), carreteraController.getAllCarreteras);
    router.get('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), carreteraController.getCarreteraById);
    router.put('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), carreteraController.updateCarretera);
    router.delete('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), carreteraController.deleteCarretera);
    router.get('/municipio/:municipio_id', authenticateToken, authorizeRole(['administrador', 'verificador']), carreteraController.getCarreterasByMunicipio);

    app.use('/carreteras', router);
};
