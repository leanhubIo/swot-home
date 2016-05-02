'use strict';
const UserService = require('./user.service');
const User = require('../models/user.model');
const Bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const Crypto = require('crypto-promise');

const SIZE_TOKEN = 48;
const ROUND = 10;

module.exports.register = function (candidate) {

    return Bcrypt.genSalt(ROUND)
        .then((salt) => Bcrypt.hash(candidate.password, salt))
        .then((hash) => Object.assign(candidate, { password: hash })) // TODO: faster
        .then((realCandidate) => UserService.save(realCandidate));
};

module.exports.validateSimple = function (request, username, password, callback) {

    return User.findOne({ name: username }).select('+password').exec()
        .then((user) => {

            if (!user) {
                return Promise.reject(Boom.notFound('user not found', { name: username }));
            }
            return Promise.all([user, Bcrypt.compare(password, user.password)]);
        })
        .then(([user, auth]) => {

            return callback(null, auth, user);
        })
        .catch((err) => callback(err, false));
};


