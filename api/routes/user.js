var { UserController, getCounters } = require('../controllers/user');
var express = require('express');
var md_auth = require('../middlewares/authenticated');
var app = express(); //.Router();
const multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });


app.get('/home', UserController.home);
app.post('/register', UserController.saveUser);
app.post('/login', UserController.loginUser);
app.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
app.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
app.put('/update-user', md_auth.ensureAuth, UserController.updateUser);
app.post('/upload-image-user', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
app.get('/get-image-user/:imageFile', UserController.getImageFile);
app.get('/counters/:id?', md_auth.ensureAuth, getCounters);

module.exports = app;