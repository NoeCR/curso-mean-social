const User = require('../models/user');
const Message = require('../models/message');
const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');

var MessageController = {
    saveMessage: (req, res) => {
        var params = req.body;

        if (!params.text || !params.receiver) { return res.status(200).send({ message: 'Envia los datos necesarios' }); }

        var message = new Message();
        message.emitter = req.user.sub;
        message.receiver = params.receiver;
        message.text = params.text;
        message.created_at = moment().unix();
        message.viewed = false;

        message.save((err, messageStored) => {
            if (err) return res.status(500).json({ message: 'Error en la petición' });
            if (!messageStored) return res.status(400).json({ message: 'Error al guardar el mensaje' });
            return res.status(200).json({ messageStored });
        });
    },
    getReceivedMessages: (req, res) => {
        var userId = req.user.sub;
        if (req.params.id && req.params.page) {
            userId = req.params.id;
        }
        var page = 1;
        if (req.params.page) {
            page = req.params.page;
        } else if (!isNaN(req.params.id)) {
            page = req.params.id;
        }
        var itemsPerPage = 4;

        Message.find({ receiver: userId })
            .populate('emitter', '_id name surname nick image')
            .paginate(page, itemsPerPage, (err, messages, total) => {
                if (err) return res.status(500).json({ message: 'Error en la petición' });
                if (!messages) return res.status(404).json({ message: 'No hay mensajes' });

                return res.status(200).json({
                    messages,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
    },
    getEmitMessages: (req, res) => {
        var userId = req.user.sub;
        if (req.params.id && req.params.page) {
            userId = req.params.id;
        }
        var page = 1;
        if (req.params.page) {
            page = req.params.page;
        } else if (!isNaN(req.params.id)) {
            page = req.params.id;
        }
        var itemsPerPage = 4;

        Message.find({ emitter: userId })
            .sort('-created_at')
            .populate('receiver', '_id name surname nick image')
            .paginate(page, itemsPerPage, (err, messages, total) => {
                if (err) return res.status(500).json({ message: 'Error en la petición' });
                if (!messages) return res.status(404).json({ message: 'No hay mensajes' });

                return res.status(200).json({
                    messages,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
    },
    getUnviewedMessages: (req, res) => {
        var userId = req.user.sub;

        Message.count({ receiver: userId, viewed: false })
            .exec((err, count) => {
                if (err) return res.status(500).json({ message: 'Error en la petición' });

                return res.status(200).json({
                    'unviewed': count
                });
            });
    },
    setViewedMessages: (req, res) => {
        var userId = req.user.sub;

        Message.update({ receiver: userId, viewed: false }, { viewed: true }, { 'multi': true }, (err, messageUpdates) => {
            if (err) return res.status(500).json({ message: 'Error en la petición' });
            return res.status(200).json({ messageUpdates });
        });
    }
}

module.exports = MessageController;