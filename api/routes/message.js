const express = require('express');
const MessageController = require('../controllers/message');
const app = express();
const md_auth = require('../middlewares/authenticated');


app.post('/message', md_auth.ensureAuth, MessageController.saveMessage);


module.exports = app;