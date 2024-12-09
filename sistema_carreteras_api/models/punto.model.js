module.exports = (sequelize, DataTypes) => {
    const Punto = sequelize.define('Punto', {
        id_punto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_carretera: {
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
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Punto;
};
