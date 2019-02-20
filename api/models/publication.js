'use strict'
const mongosee = require('mongoose');

var Schema = mongosee.Schema;

var PublicationSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    text: String,
    file: String,
    created_at: String
});

module.exports = mongosee.model('Publication', PublicationSchema);