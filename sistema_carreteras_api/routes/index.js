module.exports = app => {
    require('./usuario.routes')(app);
    require('./carretera.routes')(app);
    require('./municipio.routes')(app);
    require('./tipo_incidente.routes')(app);
    require('./solicitud_incidente.routes')(app);
    require('./foto_incidente.routes')(app);
    require('./incidente.routes')(app);
    require('./punto.routes')(app);
    require('./historial.routes')(app);
};
