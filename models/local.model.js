const { Schema, model } = require('mongoose');

const localSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    localNumber: {
        type: Number,
        required: true,
        unique: true
    },
    predioNumber: {
        type: Number,
        required: true,
        unique: true
    },
    sector: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    hallNumber: {
        type: String,
        required: true
    }
})

const LocalModel = model('local', localSchema)

module.exports = LocalModel
