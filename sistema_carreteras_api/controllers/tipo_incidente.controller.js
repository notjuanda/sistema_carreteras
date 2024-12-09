const db = require('../models');
const TipoIncidente = db.TipoIncidente;
const registrarHistorial = require('../helpers/historial.helper');

module.exports = {
    async createTipoIncidente(req, res) {
        try {
            const { nombre_tipo_incidente } = req.body;

            if (!nombre_tipo_incidente) {
                return res.status(400).json({ msg: 'El nombre del tipo de incidente es obligatorio.' });
            }

            const nuevoTipoIncidente = await TipoIncidente.create({ nombre_tipo_incidente });

            await registrarHistorial(req.usuario.id, 'creación', 'tipo_incidente', nuevoTipoIncidente.id_tipo_incidente);

            res.status(201).json({ msg: 'Tipo de incidente creado con éxito', tipoIncidente: nuevoTipoIncidente });
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear el tipo de incidente.', error });
        }
    },

    async getAllTiposIncidente(req, res) {
        try {
            const tiposIncidente = await TipoIncidente.findAll();

            res.status(200).json(tiposIncidente);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener la lista de tipos de incidente.', error });
        }
    },

    async getTipoIncidenteById(req, res) {
        try {
            const { id } = req.params;

            const tipoIncidente = await TipoIncidente.findByPk(id);

            if (!tipoIncidente) {
                return res.status(404).json({ msg: 'Tipo de incidente no encontrado.' });
            }

            res.status(200).json(tipoIncidente);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener el tipo de incidente.', error });
        }
    },

    async updateTipoIncidente(req, res) {
        try {
            const { id } = req.params;
            const { nombre_tipo_incidente } = req.body;

            const tipoIncidente = await TipoIncidente.findByPk(id);

            if (!tipoIncidente) {
                return res.status(404).json({ msg: 'Tipo de incidente no encontrado.' });
            }

            await tipoIncidente.update({ nombre_tipo_incidente });

            await registrarHistorial(req.usuario.id, 'edición', 'tipo_incidente', id);

            res.status(200).json({ msg: 'Tipo de incidente actualizado con éxito', tipoIncidente });
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar el tipo de incidente.', error });
        }
    },

    async deleteTipoIncidente(req, res) {
        try {
            const { id } = req.params;

            const tipoIncidente = await TipoIncidente.findByPk(id);

            if (!tipoIncidente) {
                return res.status(404).json({ msg: 'Tipo de incidente no encontrado.' });
            }

            await tipoIncidente.destroy();

            await registrarHistorial(req.usuario.id, 'eliminación', 'tipo_incidente', id);

            res.status(200).json({ msg: 'Tipo de incidente eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar el tipo de incidente.', error });
        }
    }
};
