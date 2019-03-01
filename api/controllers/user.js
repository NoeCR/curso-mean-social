const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const Follow = require('../models/follow');
const Publication = require('../models/publication');
const jwt = require('../services/jwt');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

var UserController = {
    home: (req, res) => {
        res.status(200).send({
            message: 'Página inicial en el controlador de usuario'
        });
    },
    saveUser: (req, res) => {
        var params = req.body;
        var user = new User();

        if (params.name && params.surname && params.email && params.password) {
            user.name = params.name;
            user.surname = params.surname;
            user.nick = params.nick;
            user.email = params.email;
            user.role = 'ROLE_USER';
            user.image = null;

            // Cifra el password y guarda los datos
            bcrypt.hash(params.password, null, null, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        message: 'Error al encriptar el password',
                        err
                    });
                }
                user.password = hash;
                user.save((err, userStored) => {
                    if (err) return res.status(500).send({ message: 'Error al guardar usuario' });
                    if (userStored) {
                        res.status(200).send({
                            user: userStored
                        });
                    } else {
                        res.status(404).send({
                            message: 'No se ha registrado el usuario'
                        });
                    }
                });
            });
        } else {
            res.status(200).send({
                message: 'Envia todos los campos'
            });
        }
    },
    loginUser: (req, res) => {
        var params = req.body;
        var email = params.email;
        var pass = params.password;

        User.findOne({ email: email }, (err, user) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' });

            if (user) {
                bcrypt.compare(pass, user.password, (err, check) => {
                    if (check) {
                        if (params.gettoken) {
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            // Devolver datos usuario
                            user.password = undefined;
                            return res.status(200).send({ user });
                        }
                    } else {
                        return res.status(404).send({ message: 'El usuario no se ha podido indentificar' });
                    }
                })
            } else {
                return res.status(404).send({ message: 'El usuario no se ha podido indentificar' });
            }
        });
    },
    getUser: (req, res) => {
        var userId = req.params.id;

        User.findById(userId, (err, userDB) => {
            if (err) return res.status(500).json({ message: 'Error al buscar en la BBDD' });
            if (!userDB) return res.status(404).json({ message: 'No se ha encontrado el usuario en la BBDD' });

            followThisUsers(req.user.sub, userId).then((value) => {
                return res.status(200).json({ userDB, value });
            });


        });
    },
    getUsers: (req, res) => {
        var client_id = req.user.sub;
        var page = 1;
        if (req.params.page) {
            page = req.params.page;
        }
        var itemsPerPage = 5;
        User.find().sort('_id').paginate(page, itemsPerPage, (err, usersDB, total) => {
            if (err) return res.status(500).json({ message: 'Error al buscar en la BBDD' });
            if (!usersDB) return res.status(404).json({ message: 'No se han encontrado usuarios en la BBDD' });

            followUserIds(client_id).then((value) => {
                return res.status(200).json({
                    usersDB,
                    users_following: value.following,
                    users_follow_me: value.followed,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
        });
    },
    updateUser: (req, res) => {
        var userId = req.user.sub;
        var update = req.body;

        // borrar propiedad password
        delete update.password;
        delete update.role;

        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdate) => {
            if (err) return res.status(500).json({ message: 'Error al buscar en la BBDD' });
            if (!userUpdate) return res.status(404).json({ message: 'No se han encontrado usuarios en la BBDD' });

            return res.status(200).json({ user: userUpdate });
        });

    },
    uploadImage: (req, res) => {
        var userId = req.user.sub;
        if (req.files) {
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split.pop();
            var file_ext = file_name.split('\.').pop();
            var ext = ['png', 'jpg', 'jpeg'];

            if (ext.includes(file_ext.toLowerCase())) {
                console.log('Extensión del archivo permitida', file_ext);
                User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdate) => {
                    if (err) return res.status(500).json({ message: 'Error al buscar en la BBDD' });
                    if (!userUpdate) return res.status(400).json({ message: 'No se encontro el usuario' });

                    return res.status(200).send({ user: userUpdate });
                })
            } else {
                removeFile(file_path, 'Extensión no valida');
            }
        }
    },
    getImageFile: (req, res) => {
        var image_file = req.params.imageFile;
        var path_file = './uploads/users/' + image_file;
        fs.exists(path_file, (exist) => {
            if (exist) {
                res.sendFile(path.resolve(path_file));
            } else {
                res.status(200).json({ message: 'No existe la imágen' });
            }
        });
    }
}

function removeFile(file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) throw err;
        return res.status(200).send({ message });
    });
}
async function followThisUsers(identity_user_id, user_id) {
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });

    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });

    return {
        following,
        followed
    }
}

async function followUserIds(user_id) {
    console.log(user_id);
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

const getCounters = (req, res) => {
    let userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    })
}

const getCountFollow = async(user_id) => {
    try {
        // Ambas formas. "following" con callback de countDocuments y "followed" con una promesa
        let following = await Follow.countDocuments({ "user": user_id }, (err, result) => { return result });
        let followed = await Follow.countDocuments({ "followed": user_id }).then(count => count);
        let publications = await Publication.countDocuments({ "user": user_id }).then(count => count);

        return { following, followed, publications }

    } catch (e) {
        console.log(e);
    }
}
module.exports = {
    UserController,
    getCounters
};