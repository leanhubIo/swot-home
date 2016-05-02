'use strict';
const AuthController = require('./api/auth.api');
const UserController = require('./api/user.api');

module.exports = [
    // Auth
    { method: 'POST', path: '/register', config: AuthController.register },
    { method: 'GET', path: '/login', config: AuthController.login },
    // TODO: logout

    // User
    { method: 'GET', path: '/users/me', config: UserController.me },
    { method: 'GET', path: '/users', config: UserController.list },
    { method: 'GET', path: '/users/{userId}', config: UserController.read }
];

