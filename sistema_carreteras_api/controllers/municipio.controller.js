const db = require('../models');
const Municipio = db.Municipio;
const registrarHistorial = require('../helpers/historial.helper');

module.exports = {
    async createMunicipio(req, res) {
        try {
            const { nombre, latitud, longitud } = req.body;

            if (!nombre || !latitud || !longitud) {
                return res.status(400).json({ msg: 'Todos los campos requeridos deben ser completados.' });
            }

            const nuevoMunicipio = await Municipio.create({
                nombre,
                latitud,
                longitud
            });

            await registrarHistorial(req.usuario.id, 'creación', 'municipio', nuevoMunicipio.id_municipio);

            res.status(201).json({ msg: 'Municipio creado con éxito', municipio: nuevoMunicipio });
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear el municipio.', error });
        }
    },

    async getAllMunicipios(req, res) {
        try {
            const municipios = await Municipio.findAll();
            res.status(200).json(municipios);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener la lista de municipios.', error });
        }
    },

    async getMunicipioById(req, res) {
        try {
            const { id } = req.params;

            const municipio = await Municipio.findByPk(id);

            if (!municipio) {
                return res.status(404).json({ msg: 'Municipio no encontrado.' });
            }

            res.status(200).json(municipio);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener el municipio.', error });
        }
    },

    async updateMunicipio(req, res) {
        try {
            const { id } = req.params;
            const { nombre, latitud, longitud } = req.body;

            const municipio = await Municipio.findByPk(id);

            if (!municipio) {
                return res.status(404).json({ msg: 'Municipio no encontrado.' });
            }

            await municipio.update({
                nombre,
                latitud,
                longitud
            });

            await registrarHistorial(req.usuario.id, 'edición', 'municipio', id);

            res.status(200).json({ msg: 'Municipio actualizado con éxito', municipio });
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar el municipio.', error });
        }
    },

    async deleteMunicipio(req, res) {
        try {
            const { id } = req.params;

            const municipio = await Municipio.findByPk(id);

            if (!municipio) {
                return res.status(404).json({ msg: 'Municipio no encontrado.' });
            }

            await municipio.destroy();

            await registrarHistorial(req.usuario.id, 'eliminación', 'municipio', id);

            res.status(200).json({ msg: 'Municipio eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar el municipio.', error });
        }
    },

    async searchMunicipio(req, res) {
        try {
            const { nombre } = req.query;

            if (!nombre) {
                return res.status(400).json({ msg: 'Debe proporcionar un nombre de municipio para la búsqueda.' });
            }

            const municipios = await Municipio.findAll({
                where: {
                    nombre: {
                        [db.Sequelize.Op.like]: `%${nombre}%`
                    }
                }
            });

            res.status(200).json(municipios);
        } catch (error) {
            res.status(500).json({ msg: 'Error al buscar el municipio.', error });
        }
    }
};
