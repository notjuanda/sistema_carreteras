module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo_usuario: {
            type: DataTypes.ENUM('administrador', 'verificador'),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Usuario;
};
