'use strict';
const UserService = require('./user.service');
const User = require('../models/user.model');
const Bcrypt = require('bcrypt-as-promised');
const Boom = require('boom');
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

const getToken = function () {

    return Crypto.randomBytes(SIZE_TOKEN)
        .then((buffer) => buffer.toString('hex'));
};

module.exports.login = function (userId) {

    return User.findById(userId).select('+token').exec()
        .then((user) => {

            if (!user) {
                return Promise.reject(Boom.notFound('user not found', { name: username }));
            }
            return Promise.all([user, getToken()]);
        })
        .then(([user, token]) => {

            if (user.token) {
                return [null, user.token, user];
            }
            user.token = token;
            return Promise.all([user.save(), token, user]);
        })
        .then(([save, token, user]) => ({ token, _id: user._id }));
};

module.exports.validateToken = function (token, callback) {

    return User.findOne({ token: token }).exec()
        .then((user) => {

            if (!user) {
                return callback(null, false);
            }
            return callback(null, true, user);
        })
        .catch((err) => callback(err, false));
};
