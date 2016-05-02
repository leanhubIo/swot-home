'use strict';
const Joi = require('joi');
const AuthService = require('../services/auth.service');

// { method: 'POST', path: '/register', config: AuthController.register },
module.exports.register = {
    description: 'register a user in the app',
    tags: ['auth'],
    auth: false,
    validate: {
        payload: {
            name: Joi.string().min(2).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            _id: Joi.any().forbidden(),
            token: Joi.any().forbidden()
        }
    },
    handler: function (request, reply) {

        request.log(['auth', 'user'], `new user ${request.payload.name}`);
        return reply(AuthService.register(request.payload));
    }
};

// { method: 'GET', path: '/login', config: AuthController.login },
module.exports.login = {
    description: 'login a user in the app',
    tags: ['auth'],
    auth: 'basic',
    handler: function (request, reply) {

        request.log(['auth', 'user'], `login ${request.auth.credentials._id}`);
        return reply(AuthService.login(request.auth.credentials._id));
    }
};


