'use strict';
const Joi = require('joi');
const UserService = require('../services/user.service');

// { method: 'GET', path: '/users/me', config: UserController.me },
module.exports.me = {
    description: 'allow a user to know himself',
    tags: ['user'],
    handler: function (request, reply) {

        request.log(['user'], `read ${request.auth.credentials._id}`);
        return reply(UserService.read(request.auth.credentials._id));
    }
};

// { method: 'GET', path: '/users', config: UserController.list },
module.exports.list = {
    description: 'allow a user to know himself',
    tags: ['user'],
    validate: {
        query: {
            name: Joi.string().min(2).required()
        }
    },
    handler: function (request, reply) {

        request.log(['user'], `list ${request.query.name}`);
        return reply(UserService.list(request.query.name));
    }
};

// { method: 'GET', path: '/users/{userId}', config: UserController.read }
module.exports.read = {
    description: 'allow a user to know himself',
    tags: ['user'],
    validate: {
        params: {
            userId: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i) // mongo id object
        }
    },
    handler: function (request, reply) {

        request.log(['user'], `read ${request.params.userId}`);
        return reply(UserService.read(request.params.userId));
    }
};

