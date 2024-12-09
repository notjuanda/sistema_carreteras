const db = require("../models");
const Punto = db.Punto;
const Carretera = db.Carretera;
const registrarHistorial = require('../helpers/historial.helper');

exports.crearPunto = async (req, res) => {
    try {
        const { id_carretera, latitud, longitud } = req.body;
        
        const carreteraExiste = await Carretera.findByPk(id_carretera);
        if (!carreteraExiste) {
            return res.status(404).json({ msg: "Carretera no encontrada." });
        }

        const nuevoPunto = await Punto.create({ id_carretera, latitud, longitud });

        await registrarHistorial(req.usuario.id, 'creación', 'punto', nuevoPunto.id_punto);

        res.status(201).json({ msg: 'Punto creado exitosamente', punto: nuevoPunto });
    } catch (error) {
        console.error(`Error en crearPunto: ${error.message}`);
        res.status(500).json({ msg: "Error interno al crear el punto." });
    }
};

exports.listarPuntosPorCarretera = async (req, res) => {
    try {
        const { id_carretera } = req.params;
        
        const carreteraExiste = await Carretera.findByPk(id_carretera);
        if (!carreteraExiste) {
            return res.status(404).json({ msg: "Carretera no encontrada." });
        }

        const puntos = await Punto.findAll({ 
            where: { id_carretera },
            order: [['id_punto', 'ASC']]
        });

        res.status(200).json(puntos);
    } catch (error) {
        console.error(`Error en listarPuntosPorCarretera: ${error.message}`);
        res.status(500).json({ msg: "Error interno al obtener los puntos de la carretera." });
    }
};

exports.obtenerPuntoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const punto = await Punto.findByPk(id);

        if (!punto) {
            return res.status(404).json({ msg: "Punto no encontrado." });
        }

        res.status(200).json(punto);
    } catch (error) {
        console.error(`Error en obtenerPuntoPorId: ${error.message}`);
        res.status(500).json({ msg: "Error interno al obtener el punto." });
    }
};

exports.editarPunto = async (req, res) => {
    try {
        const { id } = req.params;
        const { latitud, longitud } = req.body;

        const [updated] = await Punto.update(
            { latitud, longitud }, 
            { where: { id_punto: id } }
        );

        if (updated === 0) {
            return res.status(404).json({ msg: "Punto no encontrado o no se realizaron cambios." });
        }

        await registrarHistorial(req.usuario.id, 'edición', 'punto', id);

        res.status(200).json({ msg: 'Punto actualizado exitosamente' });
    } catch (error) {
        console.error(`Error en editarPunto: ${error.message}`);
        res.status(500).json({ msg: "Error interno al actualizar el punto." });
    }
};

exports.eliminarPunto = async (req, res) => {
    try {
        const { id } = req.params;
        const punto = await Punto.findByPk(id);

        if (!punto) {
            return res.status(404).json({ msg: "Punto no encontrado." });
        }

        await punto.destroy();

        await registrarHistorial(req.usuario.id, 'eliminación', 'punto', id);

        res.status(200).json({ msg: "Punto eliminado exitosamente." });
    } catch (error) {
        console.error(`Error en eliminarPunto: ${error.message}`);
        res.status(500).json({ msg: "Error interno al eliminar el punto." });
    }
};
