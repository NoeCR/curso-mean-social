var UserController = require('../controllers/user');
var express = require('express');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);



module.exports = api;