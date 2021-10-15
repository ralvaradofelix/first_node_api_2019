const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
    },
    size: {
        type: Number
    },
    type: {
        type: String
    },
    original: {
        type: String
    },
    profileImg: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    ruta: {
        type: String
    },
    date: {
        type: Number
    }
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)