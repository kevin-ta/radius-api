var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
    username  : {
        type: String,
        required: true,
        unique: true
    },
    email     : {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password  : {
        type: String,
        required: true
    },
    firstname : {
        type: String,
        required: true
    },
    lastname  : {
        type: String,
        required: true
    },
    lastname  : {
        type: String,
        required: true
    },
    role      : {
        type: String,
        required: true,
        default: 'user'
    }
});

module.exports = mongoose.model('User', UserSchema);