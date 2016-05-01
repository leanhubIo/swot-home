'use strict';
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const userSchema = Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        select: false,
        unique: true
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
        required: true
    },
    token: {
        type: String,
        select: false,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
});

module.exports = Mongoose.model('User', userSchema);
