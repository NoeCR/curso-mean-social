const PublicationController = require('../controllers/publication');
const express = require('express');
const md_auth = require('../middlewares/authenticated');
const app = express();
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/publications' });



app.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
app.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
app.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
app.delete('/publication/:id', md_auth.ensureAuth, PublicationController.removePublication);
app.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadFile);

module.exports = app;