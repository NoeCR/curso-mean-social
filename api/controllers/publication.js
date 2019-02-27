const User = require('../models/user');
const Follow = require('../models/follow');
const Publication = require('../models/publication');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');



var PublicationController = {
    prueba: (req, res) => {
        res.status(200).json({
            message: 'Prueba de controllador'
        });
    }


}

module.exports = PublicationController;