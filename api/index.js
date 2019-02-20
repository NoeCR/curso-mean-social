'use strict'
var mongoose = require('mongoose');
var app = require('./app');
const port = process.env.PORT || 3800;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social', { useNewUrlParser: true })
    .then(() => {
        console.log('Conexion a la BBDD se ha realizado correctamente');
        app.listen(port, () => {
            console.log('Servidor en funcionamiento en puerto ', port);
        })
    })
    .catch((err) => console.log(err));