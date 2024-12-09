module.exports = app => {
    const tipoIncidenteController = require("../controllers/tipo_incidente.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    // acceso publico
    router.get('/public', tipoIncidenteController.getAllTiposIncidente);

    // rutas administracion
    router.post('/', authenticateToken, authorizeRole(['administrador', 'verificador']), tipoIncidenteController.createTipoIncidente);
    router.get('/', authenticateToken, authorizeRole(['administrador', 'verificador']), tipoIncidenteController.getAllTiposIncidente);
    router.get('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), tipoIncidenteController.getTipoIncidenteById);
    router.put('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), tipoIncidenteController.updateTipoIncidente);
    router.delete('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), tipoIncidenteController.deleteTipoIncidente);

    app.use('/tipos-incidente', router);
};
