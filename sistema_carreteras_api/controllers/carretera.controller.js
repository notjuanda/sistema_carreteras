const db = require('../models');
const Carretera = db.Carretera;
const Municipio = db.Municipio;
const Punto = db.Punto;
const Incidente = db.Incidente;
const registrarHistorial = require('../helpers/historial.helper');

module.exports = {
    async createCarretera(req, res) {
        try {
            const { nombre, id_municipio_origen, id_municipio_destino, estado, descripcion } = req.body;

            if (!nombre || !id_municipio_origen || !id_municipio_destino || !estado) {
                return res.status(400).json({ msg: 'Todos los campos requeridos deben ser completados.' });
            }

            const nuevaCarretera = await Carretera.create({
                nombre,
                id_municipio_origen,
                id_municipio_destino,
                estado,
                descripcion
            });

            await registrarHistorial(req.usuario.id, 'creación', 'carretera', nuevaCarretera.id_carretera);

            const carreteraConAsociaciones = await Carretera.findByPk(nuevaCarretera.id_carretera, {
                include: [
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre', 'latitud', 'longitud'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre', 'latitud', 'longitud'] },
                    { model: Punto, as: 'puntos', attributes: ['id_punto', 'latitud', 'longitud'] }
                ]
            });

            res.status(201).json({ msg: 'Carretera creada con éxito', carretera: carreteraConAsociaciones });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear la carretera.', error });
        }
    },

    async getAllCarreteras(req, res) {
        try {
            const carreteras = await Carretera.findAll({
                include: [
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre', 'latitud', 'longitud'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre', 'latitud', 'longitud'] },
                    { model: Punto, as: 'puntos', attributes: ['id_punto', 'latitud', 'longitud'] }
                ],
                order: [['id_carretera', 'ASC']]
            });
            res.status(200).json(carreteras);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener la lista de carreteras.', error });
        }
    },

    async getCarreteraById(req, res) {
        try {
            const { id } = req.params;

            const carretera = await Carretera.findByPk(id, {
                include: [
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre', 'latitud', 'longitud'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre', 'latitud', 'longitud'] },
                    { model: Punto, as: 'puntos', attributes: ['id_punto', 'latitud', 'longitud'] }
                ]
            });

            if (!carretera) {
                return res.status(404).json({ msg: 'Carretera no encontrada.' });
            }

            res.status(200).json(carretera);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener la carretera.', error });
        }
    },

    async getCarreteraWithMunicipios(req, res) {
        try {
            const { id } = req.params;

            const carretera = await Carretera.findByPk(id, {
                include: [
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre', 'latitud', 'longitud'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre', 'latitud', 'longitud'] }
                ]
            });

            if (!carretera) {
                return res.status(404).json({ msg: 'Carretera no encontrada.' });
            }

            res.status(200).json(carretera);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener la carretera con municipios.', error });
        }
    },

    async updateCarretera(req, res) {
        try {
            const { id } = req.params;
            const { nombre, id_municipio_origen, id_municipio_destino, estado, descripcion } = req.body;

            const carretera = await Carretera.findByPk(id);

            if (!carretera) {
                return res.status(404).json({ msg: 'Carretera no encontrada.' });
            }

            await carretera.update({
                nombre,
                id_municipio_origen,
                id_municipio_destino,
                estado,
                descripcion
            });

            await registrarHistorial(req.usuario.id, 'edición', 'carretera', carretera.id_carretera);

            const carreteraActualizada = await Carretera.findByPk(id, {
                include: [
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre'] },
                    { model: Punto, as: 'puntos', attributes: ['id_punto', 'latitud', 'longitud'] }
                ]
            });

            res.status(200).json({ msg: 'Carretera actualizada con éxito', carretera: carreteraActualizada });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al actualizar la carretera.', error });
        }
    },

    async deleteCarretera(req, res) {
        try {
            const { id } = req.params;

            const carretera = await Carretera.findByPk(id);

            if (!carretera) {
                return res.status(404).json({ msg: 'Carretera no encontrada.' });
            }

            await carretera.destroy();

            await registrarHistorial(req.usuario.id, 'eliminación', 'carretera', carretera.id_carretera);
            res.status(200).json({ msg: 'Carretera eliminada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar la carretera.', error });
        }
    },

    async getCarreterasByMunicipio(req, res) {
        try {
            const { municipio_id } = req.params;

            const carreteras = await Carretera.findAll({
                where: {
                    [db.Sequelize.Op.or]: [
                        { id_municipio_origen: municipio_id },
                        { id_municipio_destino: municipio_id }
                    ]
                },
                include: [
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre'] },
                    { model: Punto, as: 'puntos', attributes: ['id_punto', 'latitud', 'longitud'] }
                ],
                order: [['id_carretera', 'ASC']]
            });

            res.status(200).json(carreteras);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener las carreteras del municipio.', error });
        }
    },

    async getPublicCarreteras(req, res) {
        try {
            const carreteras = await Carretera.findAll({
                where: { estado: 'libre' },
                include: [
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre'] },
                    { model: Punto, as: 'puntos', attributes: ['id_punto', 'latitud', 'longitud'] }
                ],
                order: [['id_carretera', 'ASC']] // Opcional
            });
            res.status(200).json(carreteras);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener la lista de carreteras públicas.', error });
        }
    },

    async getPublicCarreteraById(req, res) {
        try {
            const { id } = req.params;

            const carretera = await Carretera.findOne({
                where: { id_carretera: id, estado: 'libre' },
                include: [
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre'] },
                    { model: Punto, as: 'puntos', attributes: ['id_punto', 'latitud', 'longitud'] }
                ]
            });

            if (!carretera) {
                return res.status(404).json({ msg: 'Carretera no encontrada.' });
            }

            res.status(200).json(carretera);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener la carretera pública.', error });
        }
    },

    async getCarreterasByIncidente(req, res) {
        try {
            const { tipo_incidente_id } = req.params;

            const carreteras = await Carretera.findAll({
                include: [
                    {
                        model: Incidente,
                        where: { id_tipo_incidente: tipo_incidente_id },
                        required: true,
                        attributes: []
                    },
                    { model: Municipio, as: 'municipioOrigen', attributes: ['nombre'] },
                    { model: Municipio, as: 'municipioDestino', attributes: ['nombre'] },
                    { model: Punto, as: 'puntos', attributes: ['id_punto', 'latitud', 'longitud'] }
                ],
                distinct: true,
                order: [['id_carretera', 'ASC']]
            });

            res.status(200).json(carreteras);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener las carreteras por tipo de incidente.', error });
        }
    },
    
};
