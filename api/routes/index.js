const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./follow'));
app.use(require('./publication'));

module.exports = app;