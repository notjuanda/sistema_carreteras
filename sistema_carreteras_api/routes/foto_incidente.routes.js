module.exports = app => {
    const fotoIncidenteController = require("../controllers/foto_incidente.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    // rutas administracion
    router.post('/', authenticateToken, authorizeRole(['administrador', 'verificador']), fotoIncidenteController.createFotoIncidente);
    router.get('/:id_incidente', authenticateToken, authorizeRole(['administrador', 'verificador']), fotoIncidenteController.getAllFotosDeIncidente);
    router.delete('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), fotoIncidenteController.deleteFotoIncidente);

    app.use('/fotos-incidente', router);
};
