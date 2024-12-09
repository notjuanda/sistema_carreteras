module.exports = (sequelize, DataTypes) => {
    const Historial = sequelize.define('Historial', {
        id_historial: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        accion: {
            type: DataTypes.ENUM('creación', 'edición', 'eliminación'),
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        entidad_afectada: {
            type: DataTypes.ENUM('usuario', 'tipo_incidente', 'solicitud_incidente', 'punto', 'municipio', 'incidente', 'foto_incidente', 'carretera'),
            allowNull: false
        },
        id_entidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Historial;
};
