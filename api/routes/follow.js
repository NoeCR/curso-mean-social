const express = require('express');
const FollowController = require('../controllers/follow');
const api = express();
const md_auth = require('../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/unfollow/:id', md_auth.ensureAuth, FollowController.unfollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followers/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowers);
api.get('/get-follows/:followed?', md_auth.ensureAuth, FollowController.getListUsers);

module.exports = api;