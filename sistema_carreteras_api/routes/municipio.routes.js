module.exports = app => {
    const municipioController = require("../controllers/municipio.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    // acceso publiuco
    router.get('/public', municipioController.getAllMunicipios);
    router.get('/public/search', municipioController.searchMunicipio);

    // ruitras administracion
    router.post('/', authenticateToken, authorizeRole(['administrador', 'verificador']), municipioController.createMunicipio);
    router.get('/', authenticateToken, authorizeRole(['administrador', 'verificador']), municipioController.getAllMunicipios);
    router.get('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), municipioController.getMunicipioById);
    router.put('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), municipioController.updateMunicipio);
    router.delete('/:id', authenticateToken, authorizeRole(['administrador', 'verificador']), municipioController.deleteMunicipio);
    router.get('/search', authenticateToken, authorizeRole(['administrador', 'verificador']), municipioController.searchMunicipio);

    app.use('/municipios', router);
};
