const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    medOrg: {
        type: mongoose.Types.ObjectId,
        ref: 'MedOrg',
        required: true
    },
    blood_group: {
        type: mongoose.SchemaTypes.String,
        enum: ['A+','A-','B+','B-','O+','O-','AB-','AB+'],
        required: true,
    },
    units: {
        type: Number,
        min: 1,
        default: 1,
    },
    claimed: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['open','close'],
        default: 'open'
    }
}, {timestamps: true});

const requestModel = mongoose.model('Request',requestSchema);

module.exports = requestModel;