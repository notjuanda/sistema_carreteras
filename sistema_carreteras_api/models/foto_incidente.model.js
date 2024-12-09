module.exports = (sequelize, DataTypes) => {
    const FotoIncidente = sequelize.define('Foto_Incidente', {
        id_foto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_incidente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url_foto: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return FotoIncidente;
};
