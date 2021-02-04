const mongoose = require('mongoose');

const poolSchema = new mongoose.Schema({
    request: {
        type: mongoose.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    donor: {
        type: mongoose.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    response: {
        type: String,
        enum: ['pending','accepted','rejected'],
        default: 'pending'
    }
},{timestamps: true});

const poolModel = mongoose.model('Pool',poolSchema);

module.exports = poolModel;