const db = require('../models');
const Historial = db.Historial;

/**
 * Registra una acción en el historial.
 * @param {number} idUsuario - El ID del usuario que realiza la acción.
 * @param {string} accion - La acción realizada (creación, edición, eliminación).
 * @param {string} entidad - La entidad afectada (carretera, usuario, municipio, incidente, etc.).
 * @param {number} idEntidad - El ID de la entidad afectada.
 */
const registrarHistorial = async (idUsuario, accion, entidad, idEntidad) => {
    try {
        console.log('[Historial] Intentando registrar acción en el historial...');
        console.log(`Datos recibidos: 
            idUsuario: ${idUsuario}, 
            accion: ${accion}, 
            entidad: ${entidad}, 
            idEntidad: ${idEntidad}`);
        
        await Historial.create({
            id_usuario: idUsuario,
            accion,
            entidad_afectada: entidad,
            id_entidad: idEntidad,
            fecha: new Date()
        });

        console.log(`[Historial] Acción registrada con éxito: ${accion} en ${entidad} (ID: ${idEntidad}) por usuario (ID: ${idUsuario})`);
    } catch (error) {
        console.error(`[Historial] Error al registrar historial: ${error.message}`);
        console.error('Detalles del error:', error);
    }
};

module.exports = registrarHistorial;
