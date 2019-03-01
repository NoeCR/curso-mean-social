'use strict'
const mongosee = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
mongosee.set('useFindAndModify', false);
var Schema = mongosee.Schema;

var UserSchema = Schema({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    nick: {
        type: String,
        unique: true,
        require: [true, 'Nick is necesary']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'Email is necesary']
    },
    password: {
        type: String,
        unique: true,
        require: [true, 'Password is necesary']
    },
    role: {
        type: String
    },
    image: {
        type: String
    }
});
UserSchema.plugin(uniqueValidator);
module.exports = mongosee.model('User', UserSchema);