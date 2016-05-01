'use strict';
const Boom = require('boom');
const User = require('../models/user.model');

const defaultServer = {
    log: console.log.bind({}, 'USER')
};

// TODO: later
/*module.exports.list = function (server = defaultServer) {

    server.log(['USER', 'LIST'], 'list users');
    return User.find().exec();
};*/

module.exports.read = function (userId, server = defaultServer) {

    server.log(['USER', 'READ'], `read user ${userId}`);
    return User.findById(userId).exec()
        .then((user) => {

            if (!user) {
                server.log(['USER', 'READ'], `not found ${userId}`);
                return Promise.reject(Boom.notFound('user not found', { userId }));
            }
            server.log(['USER', 'READ'], `found ${userId}`);
            return user;
        });
};

module.exports.save = function (candidateUser, server = defaultServer) {

    server.log(['USER', 'SAVE'], `create user ${candidateUser.email}`);
    const user = new User(candidateUser);
    return user.save()
        .then(() => {

            server.log(['USER', 'SAVE'], `created user ${user._id}`);
            return user;
        })
        .catch((err) => {

            throw Boom.conflict(err.message);
        });
    // TODO: OPSEC on err message...
    // TODO: catch non conflict error
    // TODO: log
};


// later
/*module.exports.update = function (userId, candidateUser, server = defaultServer) {

    server.log(['USER', 'UPDATE'], `update user ${userId}`);
    return User.findOneAndUpdate({ _id: userId }, { $set: candidateUser }, { new: true }).exec()
        .then((user) => {

            if (!user) {
                server.log(['USER', 'UPDATE'], `not found ${userId}`);
                return Promise.reject(Boom.notFound('user not found', { userId }));
            }
            server.log(['USER', 'UPDATE'], `updated user ${userId}`);
            return user;
        })
        .catch((err) => {

            if (err.output && err.output.statusCode) {
                throw err;
            }
            throw Boom.conflict(err.message);
        });
    // TODO: OPSEC on err message...
    // TODO: catch non conflict error
    // TODO: log
};*/

// TODO: destroy ?
