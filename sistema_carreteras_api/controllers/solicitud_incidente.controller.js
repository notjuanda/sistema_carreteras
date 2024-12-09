const db = require('../models');
const SolicitudIncidente = db.SolicitudIncidente;
const registrarHistorial = require('../helpers/historial.helper');
const path = require('path');
const fs = require('fs');

module.exports = {
    async createSolicitudIncidente(req, res) {
        try {
            const { descripcion } = req.body;

            if (!descripcion) {
                return res.status(400).json({ msg: 'La descripción de la solicitud es obligatoria.' });
            }

            const nuevaSolicitud = await SolicitudIncidente.create({
                descripcion,
                fecha: new Date(),
                estado: 'pendiente'
            });

            const imagenUrl = await subirImagenSolicitud(req, nuevaSolicitud.id_solicitud);

            if (imagenUrl) {
                await nuevaSolicitud.update({ url_foto: imagenUrl });
            }

            await registrarHistorial(req.usuario.id, 'creación', 'solicitud_incidente', nuevaSolicitud.id_solicitud);

            res.status(201).json({ msg: 'Solicitud de incidente creada con éxito', solicitud: nuevaSolicitud });
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear la solicitud de incidente.', error });
        }
    },

    async getAllSolicitudes(req, res) {
        try {
            const solicitudes = await SolicitudIncidente.findAll();
            res.status(200).json(solicitudes);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener la lista de solicitudes de incidente.', error });
        }
    },

    async getSolicitudById(req, res) {
        try {
            const { id } = req.params;

            const solicitud = await SolicitudIncidente.findByPk(id);

            if (!solicitud) {
                return res.status(404).json({ msg: 'Solicitud de incidente no encontrada.' });
            }

            res.status(200).json(solicitud);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener la solicitud de incidente.', error });
        }
    },

    async updateSolicitud(req, res) {
        try {
            const { id } = req.params;
            const { descripcion, estado } = req.body;

            const solicitud = await SolicitudIncidente.findByPk(id);

            if (!solicitud) {
                return res.status(404).json({ msg: 'Solicitud de incidente no encontrada.' });
            }

            await solicitud.update({
                descripcion,
                estado
            });

            const imagenUrl = await subirImagenSolicitud(req, id);
            if (imagenUrl) {
                await solicitud.update({ url_foto: imagenUrl });
            }

            await registrarHistorial(req.usuario.id, 'edición', 'solicitud_incidente', id);

            res.status(200).json({ msg: 'Solicitud de incidente actualizada con éxito', solicitud });
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar la solicitud de incidente.', error });
        }
    },

    async deleteSolicitud(req, res) {
        try {
            const { id } = req.params;

            const solicitud = await SolicitudIncidente.findByPk(id);

            if (!solicitud) {
                return res.status(404).json({ msg: 'Solicitud de incidente no encontrada.' });
            }

            if (solicitud.url_foto) {
                const imagePath = path.join(__dirname, '..', 'public', solicitud.url_foto);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await solicitud.destroy();

            await registrarHistorial(req.usuario.id, 'eliminación', 'solicitud_incidente', id);

            res.status(200).json({ msg: 'Solicitud de incidente eliminada con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar la solicitud de incidente.', error });
        }
    }
};

const subirImagenSolicitud = (req, idSolicitud) => {
    return new Promise((resolve, reject) => {
        if (!req.files?.imagen) {
            resolve(null);
            return;
        }

        const imagen = req.files.imagen;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(imagen.mimetype)) {
            reject({ msg: 'Formato de imagen no válido, solo se permiten JPG, PNG o WEBP' });
            return;
        }

        const imagePath = path.join(__dirname, '..', 'public', 'images', 'solicitudes', `${idSolicitud}.jpg`);

        imagen.mv(imagePath, function (err) {
            if (err) {
                reject({ msg: 'Error al subir la imagen', error: err });
            } else {
                const imagenUrl = `/images/solicitudes/${idSolicitud}.jpg`;
                resolve(imagenUrl);
            }
        });
    });
}