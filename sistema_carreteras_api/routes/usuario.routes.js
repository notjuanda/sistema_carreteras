module.exports = app => {
    const usuarioController = require("../controllers/usuario.controller");
    const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
    let router = require("express").Router();

    router.post('/login', usuarioController.login);
    router.post('/', authenticateToken, authorizeRole(['administrador']), usuarioController.createUser);
    router.get('/', authenticateToken, authorizeRole(['administrador']), usuarioController.getAllUsers);
    router.get('/:id', authenticateToken, authorizeRole(['administrador']), usuarioController.getUserById);
    router.put('/:id', authenticateToken, authorizeRole(['administrador']), usuarioController.updateUser);
    router.patch('/:id/contrasenia', authenticateToken, authorizeRole(['administrador']), usuarioController.changePassword);
    router.delete('/:id', authenticateToken, authorizeRole(['administrador']), usuarioController.deleteUser);

    app.use('/usuarios', router);
};
