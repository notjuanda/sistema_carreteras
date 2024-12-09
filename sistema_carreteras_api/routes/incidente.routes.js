module.exports = app => {
    const incidenteController = require("../controllers/incidente.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    // acceso publico
    router.get('/public', incidenteController.listarIncidentes);
    router.get('/public/:id', incidenteController.obtenerIncidentePorId);

    // rutas administracion
    router.post('/', authenticateToken, authorizeRole(['administrador', 'verificador']), incidenteController.crearIncidente);
    router.get('/', authenticateToken, authorizeRole(['administrador', 'verificador']), incidenteController.listarIncidentes);
    router.get('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), incidenteController.obtenerIncidentePorId);
    router.put('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), incidenteController.editarIncidente);
    router.delete('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), incidenteController.eliminarIncidente);

    app.use('/incidentes', router);
};
