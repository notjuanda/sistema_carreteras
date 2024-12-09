module.exports = (sequelize, DataTypes) => {
    const TipoIncidente = sequelize.define('Tipo_Incidente', {
        id_tipo_incidente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_tipo_incidente: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return TipoIncidente;
};
