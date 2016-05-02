'use strict';
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        select: false
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    token: {
        type: String,
        select: false,
        unique: true,
        index: true
    }
});

const User = module.exports = Mongoose.model('User', userSchema);

module.exports.ensureCustomIndexes = function () {

    return Mongoose.connection.collections[User.collection.name].createIndex({ name: 1 }, { unique: true })
        .then(() => Mongoose.connection.collections[User.collection.name].createIndex({ email: 1 }, { unique: true, sparse: true }))
        .then(() => Mongoose.connection.collections[User.collection.name].createIndex({ token: 1 }, { unique: true, sparse: true }));
};
