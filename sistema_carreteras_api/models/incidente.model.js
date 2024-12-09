module.exports = (sequelize, DataTypes) => {
    const Incidente = sequelize.define('Incidente', {
        id_incidente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_carretera: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_incidente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        latitud: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false
        },
        longitud: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Incidente;
};
