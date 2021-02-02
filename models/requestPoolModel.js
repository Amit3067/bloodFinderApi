const mongoose = require('mongoose');

const poolSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Request'
    },
    donor_id: {
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