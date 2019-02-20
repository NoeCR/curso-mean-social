'use strict'
const mongosee = require('mongoose');

var Schema = mongosee.Schema;

var FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    followed: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongosee.model('Follow', FollowSchema);