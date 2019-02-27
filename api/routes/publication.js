const PublicationController = require('../controllers/publication');
const express = require('express');
const md_auth = require('../middlewares/authenticated');
const api = express(); //.Router();
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/publications' });



api.get('/prueba-pub', md_auth.ensureAuth, PublicationController.prueba);

module.exports = api;