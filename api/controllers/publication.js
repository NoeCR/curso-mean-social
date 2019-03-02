const User = require('../models/user');
const Follow = require('../models/follow');
const Publication = require('../models/publication');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');



var PublicationController = {
    savePublication: (req, res) => {
        let user = req.user.sub;
        let params = req.body;
        if (!params.text) { return res.status(200).json({ message: 'Debes enviar un texto!' }) }

        let publication = new Publication();


        publication.user = user;
        publication.text = req.sanitize(params.text);

        publication.file = null;
        publication.created_at = moment().unix();
        publication.save((err, publicationStored) => {
            if (err) { return res.status(500).json({ message: 'Error al guardar la publicación' }) }
            if (!publicationStored) { return res.status(404).json({ message: 'No se a podido guardar la publicación' }) }

            return res.status(200).json({ publication: publicationStored });
        });
    },
    getPublications: (req, res) => {
        var page = 1;
        var itemsPerPage = 4;

        if (req.params.page) {
            page = req.params.page;
        }

        Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
            if (err) { return res.status(500).json({ message: 'Error al obtener el seguimiento' }) }

            var follows_clean = [];
            follows.forEach((follow) => {
                follows_clean.push(follow.followed);
            });
            follows_clean.push(req.user.sub);
            Publication.find({ user: { "$in": follows_clean } })
                .sort('-created_at')
                .populate('user')
                .paginate(page, itemsPerPage, (err, publications, total) => {
                    if (err) { return res.status(500).json({ message: 'Error al obtener las publicaciones' }) }
                    if (!publications) { return res.status(404).json({ message: 'No hay publicaciones' }) }

                    return res.status(200).json({
                        total,
                        publications,
                        page,
                        itemsPerPage,
                        pages: Math.ceil(total / itemsPerPage)
                    });
                });
        });
    },
    getPublication: (req, res) => {
        var pubId = req.params.id;
        Publication.findById(pubId, (err, publication) => {
            if (err) { return res.status(500).json({ message: 'Error al obtener la publicación' }) }
            if (!publication) { return res.status(404).json({ message: 'No existe la publicación' }) }

            return res.status(200).json({
                publication
            });
        });
    },
    removePublication: (req, res) => {
        var pubId = req.params.id;
        Publication.find({ 'user': req.user.sub, '_id': pubId }).deleteOne((err, publicationRemoved) => {
            if (err) { return res.status(500).json({ message: 'Error al eliminar la publicación' }) }
            if (!publicationRemoved) { return res.status(404).json({ message: 'No existe la publicación' }) }

            if (publicationRemoved.n == 1) {
                return res.status(200).send({ message: 'Publicacion eliminada correctamente' });
            } else {
                return res.status(404).send({ message: 'Error al borrar publicacion, no tiene los permisos necesarios' });
            }
        });
    },
    uploadFile: (req, res) => {
        var pubId = req.params.id;

        if (req.files) {
            var file_path = req.files.file.path;
            var file_split = file_path.split('\\');
            var file_name = file_split.pop();
            var file_ext = file_name.split('\.').pop();
            var ext = ['jpg', 'png', 'jpeg']; // next extensions 'pdf', 'doc', 'txt', 

            if (ext.includes(file_ext.toLowerCase())) {

                Publication.findOne({ 'user': req.user.sub, '_id': pubId }).exec((err, pub) => {
                    if (err) { return res.status(500).json({ message: 'Error al encontrar la publicación' }) }
                    if (pub) {
                        Publication.findByIdAndUpdate(pubId, { file: file_name }, { new: true }, (err, pubUpdate) => {
                            if (err) return res.status(500).json({ message: 'Error al buscar en la BBDD' });
                            if (!pubUpdate) return res.status(400).json({ message: 'No se encontro la publicación' });

                            return res.status(200).json({ pubUpdate });
                        });
                    } else {
                        return removeFile(res, file_path, 'No tienes permisos para actualizar la publicación');
                    }
                });
            } else {
                return removeFile(res, file_path, 'Extensión no valida');
            }
        }
    }
}

function removeFile(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) throw err;
        return res.status(200).json({ message });
    });
}
module.exports = PublicationController;