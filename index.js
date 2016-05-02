'use strict';
const AuthBearer = require('hapi-auth-bearer-token');

const AuthBasic = require('hapi-auth-basic');
const AuthService = require('./lib/services/auth.service');

const Routes = require('./lib/routes');

exports.register = function (server, options, next) {

    return server.register(AuthBasic)
        .then(() => server.register(AuthBearer))
        .then(() => {

            server.auth.strategy('basic', 'basic', { validateFunc: AuthService.validateSimple });
            server.auth.strategy('bearer', 'bearer-access-token', { validateFunc: AuthService.validateToken });
            server.auth.default('bearer');
        })
        .then(() => {

            server.route(Routes);
        })
        .then(() =>  next())
        .catch((err) =>  next(err));
};

exports.register.attributes = {
    pkg: require('./package.json')
};
