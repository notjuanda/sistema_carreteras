const { STRING } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Carretera = sequelize.define('Carretera', {
        id_carretera: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_municipio_origen: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_municipio_destino: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
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

    return Carretera;
};
