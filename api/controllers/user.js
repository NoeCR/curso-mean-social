const bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

var UserController = {
    home: (req, res) => {
        res.status(200).send({
            message: 'Página inicial en el controlador de usuario'
        });
    },
    pruebas: (req, res) => {
        res.status(200).send({
            message: 'Página de pruebas del controllador de usuario'
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
    }
}


module.exports = UserController;