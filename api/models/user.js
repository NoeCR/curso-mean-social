'use strict'
const mongosee = require('mongoose');

var Schema = mongosee.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongosee.model('User', UserSchema);