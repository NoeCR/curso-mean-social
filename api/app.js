'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas

// cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// cors

// rutas
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Página inicial en servidor de Nodejs'
    });
});
app.get('/pruebas', (req, res) => {
    res.status(200).send({
        message: 'Acción de pruebas en servidor de Nodejs'
    });
});

module.exports = app;