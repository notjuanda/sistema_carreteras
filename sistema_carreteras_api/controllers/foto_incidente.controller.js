const db = require('../models');
const FotoIncidente = db.FotoIncidente;
const registrarHistorial = require('../helpers/historial.helper');
const path = require('path');
const fs = require('fs');

module.exports = {
    async createFotoIncidente(req, res) {
        try {
            const { id_incidente } = req.body;

            if (!id_incidente) {
                return res.status(400).json({ msg: 'El ID del incidente es obligatorio.' });
            }

            const imagenUrl = await subirImagenFotoIncidente(req, id_incidente);

            if (!imagenUrl) {
                return res.status(400).json({ msg: 'Error al subir la imagen.' });
            }

            const nuevaFoto = await FotoIncidente.create({
                id_incidente,
                url_foto: imagenUrl
            });

            await registrarHistorial(req.usuario.id, 'creación', 'foto_incidente', nuevaFoto.id_foto);

            res.status(201).json({ msg: 'Foto de incidente agregada con éxito', foto: nuevaFoto });
        } catch (error) {
            res.status(500).json({ msg: 'Error al agregar la foto de incidente.', error });
        }
    },

    async getAllFotosDeIncidente(req, res) {
        try {
            const { id_incidente } = req.params;

            const fotos = await FotoIncidente.findAll({ where: { id_incidente } });
            res.status(200).json(fotos);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener las fotos del incidente.', error });
        }
    },

    async deleteFotoIncidente(req, res) {
        try {
            const { id } = req.params;

            const foto = await FotoIncidente.findByPk(id);

            if (!foto) {
                return res.status(404).json({ msg: 'Foto de incidente no encontrada.' });
            }

            if (foto.url_foto) {
                const imagePath = path.join(__dirname, '..', 'public', foto.url_foto);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await foto.destroy();

            await registrarHistorial(req.usuario.id, 'eliminación', 'foto_incidente', foto.id_foto); // Registro en el historial

            res.status(200).json({ msg: 'Foto de incidente eliminada con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar la foto de incidente.', error });
        }
    }
};

const subirImagenFotoIncidente = (req, idIncidente) => {
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

        const imagePath = path.join(__dirname, '..', 'public', 'images', 'incidentes', `${idIncidente}_${Date.now()}.jpg`);

        imagen.mv(imagePath, function (err) {
            if (err) {
                reject({ msg: 'Error al subir la imagen', error: err });
            } else {
                const imagenUrl = `/images/incidentes/${path.basename(imagePath)}`;
                resolve(imagenUrl);
            }
        });
    });
};
