const db = require('../models');
const Incidente = db.Incidente;
const FotoIncidente = db.FotoIncidente;
const registrarHistorial = require('../helpers/historial.helper');
const path = require('path');
const fs = require('fs');

exports.crearIncidente = async (req, res) => {
    try {
        const { id_carretera, id_tipo_incidente, latitud, longitud, descripcion } = req.body;

        const nuevoIncidente = await Incidente.create({
            id_carretera,
            id_tipo_incidente,
            latitud,
            longitud,
            descripcion
        });

        const idEntidad = nuevoIncidente.id_incidente;

        if (req.files && req.files.imagen) {
            const imagenUrl = await subirImagenIncidente(req, idEntidad);
            if (imagenUrl) {
                await FotoIncidente.create({ 
                    id_incidente: idEntidad, 
                    url_foto: imagenUrl 
                });
            }
        }

        await registrarHistorial(req.usuario.id, 'creación', 'incidente', idEntidad);

        res.status(201).json({ msg: 'Incidente creado con éxito', incidente: nuevoIncidente });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el incidente.', error: error.message });
    }
};

exports.listarIncidentes = async (req, res) => {
    try {
        const incidentes = await Incidente.findAll({
            include: [{ model: FotoIncidente, as: 'fotos' }]
        });
        res.status(200).json(incidentes);
    } catch (error) {
        res.status(500).json({ msg: 'Error al listar los incidentes.', error: error.message });
    }
};

exports.obtenerIncidentePorId = async (req, res) => {
    const { id } = req.params;
    try {
        const incidente = await Incidente.findByPk(id, {
            include: [{ model: FotoIncidente }]
        });

        if (!incidente) {
            return res.status(404).json({ msg: 'Incidente no encontrado.' });
        }

        res.status(200).json(incidente);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el incidente.', error: error.message });
    }
};

exports.editarIncidente = async (req, res) => {
    const { id } = req.params;
    const { id_carretera, id_tipo_incidente, latitud, longitud, descripcion } = req.body;

    try {
        await Incidente.update(
            { id_carretera, id_tipo_incidente, latitud, longitud, descripcion },
            { where: { id_incidente: id } }
        );

        if (req.files && req.files.imagen) {
            const imagenUrl = await subirImagenIncidente(req, id);
            if (imagenUrl) {
                await FotoIncidente.create({ 
                    id_incidente: id, 
                    url_foto: imagenUrl 
                });
            }
        }

        await registrarHistorial(req.usuario.id, 'edición', 'incidente', id);

        res.status(200).json({ msg: 'Incidente actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el incidente.', error: error.message });
    }
};

exports.eliminarIncidente = async (req, res) => {
    const { id } = req.params;

    try {
        const incidente = await Incidente.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ msg: 'Incidente no encontrado.' });
        }

        const fotos = await FotoIncidente.findAll({ where: { id_incidente: id } });

        for (const foto of fotos) {
            const imagePath = path.join(__dirname, '..', 'public', foto.url_foto);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            await foto.destroy();
        }

        await incidente.destroy();

        await registrarHistorial(req.usuario.id, 'eliminación', 'incidente', id);

        res.status(200).json({ msg: 'Incidente eliminado con éxito.' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el incidente.', error: error.message });
    }
};

const subirImagenIncidente = (req, idIncidente) => {
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

        const carpeta = path.join(__dirname, '..', 'public', 'images', 'incidentes');
        if (!fs.existsSync(carpeta)) {
            fs.mkdirSync(carpeta, { recursive: true });
        }

        const imagePath = path.join(carpeta, `${idIncidente}_${Date.now()}.jpg`);
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
