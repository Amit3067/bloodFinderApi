const mongoose = require('mongoose');

const poolSchema = new mongoose.Schema({
    request: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Request'
    },
    donor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Donor'
    },
    response: {
        type: String,
        enum: ['pending','accepted','rejected'],
        default: 'pending'
    }
},{timestamps: true});

const poolModel = mongoose.model('Pool',poolSchema);

module.exports = poolModel;