const express = require('express');
const MessageController = require('../controllers/message');
const app = express();
const md_auth = require('../middlewares/authenticated');


app.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
app.get('/messages/:id?/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
app.get('/emit-messages/:id?/:page?', md_auth.ensureAuth, MessageController.getEmitMessages);
app.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
app.put('/setiewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = app;