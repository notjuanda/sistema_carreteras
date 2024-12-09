const db = require("../models");
const Historial = db.Historial;
const Usuario = db.Usuario;
const Carretera = db.Carretera;
const Municipio = db.Municipio;
const Incidente = db.Incidente;
const { Op } = require("sequelize");

exports.obtenerHistorial = async (req, res) => {
    try {
        const { entidad, accion, fechaInicio, fechaFin, limite = 50, pagina = 1 } = req.query;
        
        const limit = parseInt(limite);
        const offset = (parseInt(pagina) - 1) * limit;

        const where = {};

        if (entidad) {
            where.entidad_afectada = entidad;
        }

        if (accion) {
            where.accion = accion;
        }

        if (fechaInicio && fechaFin) {
            where.fecha = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }

        const historial = await Historial.findAndCountAll({
            where,
            order: [['fecha', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['nombre'], 
                }
            ]
        });

        const historialConNombreUsuario = historial.rows.map(item => ({
            ...item.dataValues,
            nombre_usuario: item.usuario ? item.usuario.nombre : 'Desconocido'
        }));

        res.status(200).json({
            total: historial.count,
            paginas: Math.ceil(historial.count / limit),
            pagina: parseInt(pagina),
            historial: historialConNombreUsuario
        });
    } catch (error) {
        console.error(`Error en obtenerHistorial: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al obtener el historial." });
    }
};

exports.obtenerUsuariosPorCambio = async (req, res) => {
    try {
        const { entidad } = req.query;
        let entidades = [];

        if (entidad === 'carretera') {
            entidades = await Carretera.findAll({
                include: [{
                    model: Historial,
                    as: 'historiales',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['nombre']
                    }],
                    where: { accion: 'edición' },
                    order: [['fecha', 'DESC']]
                }],
                order: [['id_carretera', 'DESC']]
            });
        } else if (entidad === 'municipio') {
            entidades = await Municipio.findAll({
                include: [{
                    model: Historial,
                    as: 'historiales',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['nombre']
                    }],
                    where: { accion: 'edición' },
                    order: [['fecha', 'DESC']]
                }],
                order: [['id_municipio', 'DESC']]
            });
        } else if (entidad === 'incidente') {
            entidades = await Incidente.findAll({
                include: [{
                    model: Historial,
                    as: 'historiales',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['nombre']
                    }],
                    where: { accion: 'edición' },
                    order: [['fecha', 'DESC']]
                }],
                order: [['id_incidente', 'DESC']]
            });
        }

        const usuariosQueRealizaronCambios = entidades.map(entidad => {
            return {
                id_entidad: entidad.id_carretera || entidad.id_municipio || entidad.id_incidente,
                nombre_usuario: entidad.historiales.length > 0 ? entidad.historiales[0].usuario.nombre : 'Desconocido',
                entidad_afectada: entidad.constructor.name.toLowerCase()
            };
        });

        res.status(200).json({
            usuarios: usuariosQueRealizaronCambios
        });
    } catch (error) {
        console.error(`Error en obtenerUsuariosPorCambio: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al obtener los usuarios que realizaron cambios." });
    }
};
