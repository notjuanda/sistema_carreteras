const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Usuario = db.Usuario;
const registrarHistorial = require('../helpers/historial.helper');

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
    async createUser(req, res) {
        try {
            const { nombre, email, contraseña, tipo_usuario } = req.body;

            if (!nombre || !email || !contraseña || !tipo_usuario) {
                return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
            }

            const hashedPassword = await bcrypt.hash(contraseña, 10);
            const nuevoUsuario = await Usuario.create({
                nombre,
                email,
                contraseña: hashedPassword,
                tipo_usuario
            });

            await registrarHistorial(req.usuario.id, 'creación', 'usuario', nuevoUsuario.id_usuario);

            res.status(201).json({ msg: 'Usuario creado con éxito.', usuario: nuevoUsuario });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json({ msg: 'El email ya está en uso.' });
            } else {
                res.status(500).json({ msg: 'Error al crear el usuario.', error });
            }
        }
    },

    async getAllUsers(req, res) {
        try {
            const usuarios = await Usuario.findAll();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener los usuarios.', error });
        }
    },

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado.' });
            }

            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener el usuario.', error });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { nombre, email, tipo_usuario } = req.body;

            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado.' });
            }

            await usuario.update({ nombre, email, tipo_usuario });

            await registrarHistorial(req.usuario.id, 'edición', 'usuario', id);

            res.status(200).json({ msg: 'Usuario actualizado con éxito.', usuario });
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar el usuario.', error });
        }
    },

    async changePassword(req, res) {
        try {
            const { id } = req.params;
            const { contraseña } = req.body;

            if (!contraseña) {
                return res.status(400).json({ msg: 'La contraseña es obligatoria.' });
            }

            const hashedPassword = await bcrypt.hash(contraseña, 10);
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado.' });
            }

            await usuario.update({ contraseña: hashedPassword });

            await registrarHistorial(req.usuario.id, 'edición', 'usuario', id);

            res.status(200).json({ msg: 'Contraseña actualizada correctamente.' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al cambiar la contraseña.', error });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado.' });
            }

            await usuario.destroy();

            await registrarHistorial(req.usuario.id, 'eliminación', 'usuario', id);

            res.status(200).json({ msg: 'Usuario eliminado correctamente.' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar el usuario.', error });
        }
    },

    async login(req, res) {
        try {
            const { email, contraseña } = req.body;

            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) {
                return res.status(404).json({ msg: 'Credenciales incorrectas.' });
            }

            const isPasswordValid = await bcrypt.compare(contraseña, usuario.contraseña);

            if (!isPasswordValid) {
                return res.status(401).json({ msg: 'Credenciales incorrectas.' });
            }

            const token = jwt.sign({ id: usuario.id_usuario, tipo: usuario.tipo_usuario }, process.env.SECRET_KEY, {
                expiresIn: '6h'
            });

            res.status(200).json({ token, usuario });
        } catch (error) {
            res.status(500).json({ msg: 'Error al iniciar sesión.', error });
        }
    }
};
