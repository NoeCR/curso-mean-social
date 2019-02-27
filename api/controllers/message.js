const User = require('../models/user');
const Message = require('../models/message');
const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');

var MessageController = {
    saveMessage: (req, res) => {
        var params = req.body;

        if (!params.text || !params.receiver) { return res.status(200).send({ message: 'Envia los datos necesarios' }); }

        var message = new Message();
        message.emmiter = req.user.sub;
        message.receiver = params.receiver;
        message.text = params.text;
        message.created_at = moment().unix();
        message.viewed = false;

        message.save((err, messageStored) => {
            if (err) return res.status(500).json({ message: 'Error en la petición' });
            if (!messageStored) return res.status(400).json({ message: 'Error al guardar el mensaje' });
            return res.status(200).json({ messageStored });
        });
    }
}

module.exports = MessageController;