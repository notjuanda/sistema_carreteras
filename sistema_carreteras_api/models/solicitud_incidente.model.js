module.exports = (sequelize, DataTypes) => {
    const SolicitudIncidente = sequelize.define('Solicitud_Incidente', {
        id_solicitud: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'en proceso', 'atendido'),
            allowNull: false
        },
        url_foto: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return SolicitudIncidente;
};
