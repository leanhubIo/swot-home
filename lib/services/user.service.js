'use strict';
const User = require('../models/user.model');
const Boom = require('boom');

module.exports.list = function (nameFragment = '') {

    return User.find({ name: new RegExp(nameFragment, 'i') }).exec();
};

module.exports.read = function (userId) {

    return User.findById(userId).exec()
        .then((user) => {

            if (!user) {
                return Promise.reject(Boom.notFound('user not found', { userId }));
            }
            return user;
        });
};

module.exports.save = function (candidate) {

    const user = new User(candidate);
    return user.save()
        .then(() => {

            user.password = '';
            return user;
        })
        .catch((err) => Promise.reject(Boom.conflict('', err.message))); // TODO: better
};
