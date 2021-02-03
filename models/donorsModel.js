const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
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
donorSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
donorSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
const donorModel = mongoose.model('Donor',donorSchema);

module.exports = donorModel;