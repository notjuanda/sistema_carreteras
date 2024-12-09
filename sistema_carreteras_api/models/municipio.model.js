module.exports = (sequelize, DataTypes) => {
    const Municipio = sequelize.define('Municipio', {
        id_municipio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        latitud: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false
        },
        longitud: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Municipio;
};
