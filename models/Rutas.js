const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rutasSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ruta: {
        type: String
    },
    pattern_id: {
        type: String
    },
    name: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    number_files: {
        type: String
    },
    nivel: {
        type: Number
    },
    date: {
        type: Number
    },
    slug: {
        type: String
    },
    ruta_real: {
        type: String
    },
}, {
    collection: 'rutas'
})

module.exports = mongoose.model('Rutas', rutasSchema)