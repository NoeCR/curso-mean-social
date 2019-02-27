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
            // si enviamos una imagen la guardara y devolvera el nombre para establecerlo en la nueva publicación
            // if (uploadFile(params.file)) {

            // }
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
            Publication.findByIdAndRemove(pubId, (err, publication) => {
                if (err) { return res.status(500).json({ message: 'Error al eliminar la publicación' }) }
                if (!publication) { return res.status(404).json({ message: 'No existe la publicación' }) }

                return res.status(200).json({
                    message: 'Publicación eliminada correctamente'
                });
            });
        }
    }
    // async function uploadFile(file) {
    //     console.log(file.path);
    //     if (file) {
    //         var file_path = file.path;
    //         var file_split = file_path.split('\\');
    //         var file_name = file_split.pop();
    //         var file_ext = file_name.split('\.').pop();
    //         console.log(file_name);
    //         var ext = ['pdf', 'doc', 'text', 'jpg', 'png', 'jpeg'];

//         if (ext.includes(file_ext.toLowerCase())) {
//             console.log('Extensión del archivo permitida', file_ext);

//             return true;
//         } else {
//             fs.unlink(file_path, (err) => {
//                 if (err) throw err;
//                 console.log('Extensión no valida');
//                 return false;
//             });
//         }
//     } else {
//         return false;
//     }
// }

module.exports = PublicationController;