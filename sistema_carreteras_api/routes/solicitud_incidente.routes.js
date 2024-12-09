module.exports = app => {
    const solicitudIncidenteController = require("../controllers/solicitud_incidente.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    // acceso publico
    router.post('/public', solicitudIncidenteController.createSolicitudIncidente);

    // rutas aadministracionm
    router.get('/', authenticateToken, authorizeRole(['administrador', 'verificador']), solicitudIncidenteController.getAllSolicitudes);
    router.get('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), solicitudIncidenteController.getSolicitudById);
    router.put('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), solicitudIncidenteController.updateSolicitud);
    router.delete('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), solicitudIncidenteController.deleteSolicitud);

    app.use('/solicitudes-incidente', router);
};
