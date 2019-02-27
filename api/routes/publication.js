const PublicationController = require('../controllers/publication');
const express = require('express');
const md_auth = require('../middlewares/authenticated');
const app = express(); //.Router();
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/publications' });



app.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
app.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
app.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
app.delete('/publication/:id', md_auth.ensureAuth, PublicationController.removePublication);

module.exports = app;