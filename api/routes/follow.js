const express = require('express');
const FollowController = require('../controllers/follow');
const app = express();
const md_auth = require('../middlewares/authenticated');

app.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
app.delete('/unfollow/:id', md_auth.ensureAuth, FollowController.unfollow);
app.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
app.get('/followers/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowers);
app.get('/get-follows/:followed?', md_auth.ensureAuth, FollowController.getListUsers);

module.exports = app;