const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    blood_group: {
        type: mongoose.SchemaTypes.String,
        enum: ['A+','A-','B+','B-','O+','O-','AB-','AB+'],
        required: true,
    },
    location: {
        type: locationSchema,
        required: true,
        index: '2dsphere'
    },
    birth_date: {
        type: mongoose.SchemaTypes.Date,
        required: true
    }
},{timestamps: true});

const donorModel = mongoose.model('Donor',donorSchema);

module.exports = donorModel;