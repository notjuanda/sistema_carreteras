const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require("./usuario.model")(sequelize, DataTypes);
db.Municipio = require("./municipio.model")(sequelize, DataTypes);
db.Carretera = require("./carretera.model")(sequelize, DataTypes);
db.Punto = require("./punto.model")(sequelize, DataTypes);
db.Incidente = require("./incidente.model")(sequelize, DataTypes);
db.TipoIncidente = require("./tipo_incidente.model")(sequelize, DataTypes);
db.FotoIncidente = require("./foto_incidente.model")(sequelize, DataTypes);
db.SolicitudIncidente = require("./solicitud_incidente.model")(sequelize, DataTypes);
db.Historial = require("./historial.model")(sequelize, DataTypes);


db.Usuario.hasMany(db.Historial, { foreignKey: "id_usuario", as: "historiales" });
db.Historial.belongsTo(db.Usuario, { foreignKey: "id_usuario", as: "usuario" });

db.Municipio.hasMany(db.Carretera, { foreignKey: "id_municipio_origen", as: "carreterasOrigen" });
db.Carretera.belongsTo(db.Municipio, { foreignKey: "id_municipio_origen", as: "municipioOrigen" });

db.Municipio.hasMany(db.Carretera, { foreignKey: "id_municipio_destino", as: "carreterasDestino" });
db.Carretera.belongsTo(db.Municipio, { foreignKey: "id_municipio_destino", as: "municipioDestino" });

db.Carretera.hasMany(db.Punto, { foreignKey: "id_carretera", as: "puntos" });
db.Punto.belongsTo(db.Carretera, { foreignKey: "id_carretera", as: "carretera" });

db.Carretera.hasMany(db.Incidente, { foreignKey: "id_carretera", as: "incidentes" });
db.Incidente.belongsTo(db.Carretera, { foreignKey: "id_carretera", as: "carretera" });

db.TipoIncidente.hasMany(db.Incidente, { foreignKey: "id_tipo_incidente", as: "incidentes" });
db.Incidente.belongsTo(db.TipoIncidente, { foreignKey: "id_tipo_incidente", as: "tipoIncidente" });

db.Incidente.hasMany(db.FotoIncidente, { foreignKey: "id_incidente", as: "fotos" });
db.FotoIncidente.belongsTo(db.Incidente, { foreignKey: "id_incidente", as: "incidente" });

module.exports = db;
