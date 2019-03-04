const mongoosePaginate = require('mongoose-pagination');
const User = require('../models/user');
const Follow = require('../models/follow');


var FollowController = {
    saveFollow: (req, res) => {
        var params = req.body;
        var follow = new Follow();

        follow.user = req.user.sub;
        follow.followed = params.followed;

        Follow.findOne({ user: follow.user, followed: follow.followed })
            .then((err, userDB) => {
                if (err) return res.status(200).json({ message: 'Ya estas siguiendo ha este usuario' });
                if (!userDB) {
                    follow.save((err, followStored) => {
                        if (err) return res.status(200).json({ message: 'Error al guardar el seguimiento' });
                        if (!followStored) return res.status(400).json({ message: 'Error: no se ha guardado el seguimiento' });

                        return res.status(200).json({ follow: followStored });
                    });
                }
            }).catch((err) => {
                console.log('Error:', err);
            });


    },
    unfollow: (req, res) => {
        var user = req.user.sub;
        var followed = req.params.id;

        Follow.findOneAndRemove({ user, followed }, (err, followRemove) => {
            if (err) return res.status(500).json({ message: 'Error 500: al eliminar el seguimiento' });
            if (!followRemove) return res.status(400).json({ message: 'Error 400: no se ha eliminado el seguimiento' });
            return res.status(200).json({ message: `Has dejado de seguir al usuario con id: ${followed}` });
        });
    },
    getFollowingUsers: (req, res) => {
        var user = req.user.sub;
        var page = 1;
        var itemsPerPage = 4;

        if (req.params.id && req.params.page) {
            user = req.params.id;
        }

        if (req.params.page) {
            page = req.params.page;
        } else if (!isNaN(req.params.id)) {
            page = req.params.id;
        }

        Follow.find({ user })
            .populate({ path: 'followed' })
            .paginate(page, itemsPerPage, (err, follows, total) => {
                if (err) return res.status(500).json({ message: 'Error 500: No se ha podido conectar con la BBDD' });
                if (!follows) return res.status(400).json({ message: 'Error 400: no se ha encontrado registros' });

                followUserIds(user).then((value) => {
                    return res.status(200).json({
                        message: 'Listado de usuarios seguidos',
                        follows,
                        users_following: value.following,
                        users_follow_me: value.followed,
                        total,
                        pages: Math.ceil(total / itemsPerPage)
                    });
                });
            });
    },
    getFollowers: (req, res) => {
        var user = req.user.sub;
        var page = 1;
        var itemsPerPage = 4;

        if (req.params.id && req.params.page) {
            user = req.params.id;
        }

        if (req.params.page) {
            page = req.params.page;
        } else if (!isNaN(req.params.id)) {
            page = req.params.id;
        }
        Follow.find({ followed: user })
            .populate('user followed')
            .paginate(page, itemsPerPage, (err, followers, total) => {
                if (err) return res.status(500).json({ message: 'Error 500: No se ha podido conectar con la BBDD' });
                if (!followers) return res.status(400).json({ message: 'Error 400: no se ha encontrado registros' });

                followUserIds(user).then((value) => {
                    return res.status(200).json({
                        message: 'Listado de usuarios que te siguen',
                        followers,
                        users_following: value.following,
                        users_follow_me: value.followed,
                        total,
                        pages: Math.ceil(total / itemsPerPage)
                    });
                });
            });
    },
    getListUsers: (req, res) => {
        var user = req.user.sub;
        var find = Follow.find({ user });
        if (req.params.followed) {
            find = Follow.find({ followed: user });
        }

        find.populate('user followed')
            .exec((err, usersDB) => {
                if (err) return res.status(500).json({ message: 'Error 500: No se ha podido conectar con la BBDD' });
                if (!usersDB) return res.status(400).json({ message: 'No se ha encontrado a ningun usuario' });
                return res.status(200).json({ usersDB });
            });
    }
}
async function followUserIds(user_id) {
    var following = await Follow.find({ user: user_id }).select({ _id: 0, _v: 0, user: 0 }).exec()
        .then((follows) => {
            var follows_clean = [];
            follows.forEach((follow) => {
                follows_clean.push(follow.followed);
            });
            return follows_clean;
        }).catch((err) => {
            return handleError(err);
        });
    var followed = await Follow.find({ followed: user_id }).select({ _id: 0, __v: 0, followed: 0 }).exec()
        .then((follows) => {
            var follows_clean = [];

            follows.forEach((follow) => {
                follows_clean.push(follow.user);
            });
            return follows_clean;
        }).catch((err) => {
            return handleError(err);
        });

    return {
        following: following,
        followed: followed
    };
}
module.exports = FollowController;