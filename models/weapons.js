var mongoose = require('mongoose');

var armaSchema = mongoose.Schema({
    descripcion: {type: String},
    fuerza: {type: Number},
    categoria: {type: String},
    municiones: {type: Boolean}
});

var Arma = mongoose.model('arma',armaSchema);
module.exports = Arma;