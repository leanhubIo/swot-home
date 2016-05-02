'use strict';
const Mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const Code = require('code'); // assertion lib
const Lab = require('lab'); // test runner
const lab = exports.lab = Lab.script();

const Glue = require('glue');
const Path = require('path');

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
// const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;

const User = require('../../lib/models/user.model');

Mongoose.Promise = global.Promise; // Personal choice

/**
 * Connect once for all tests
 */
before(() => Mongoose.connect(`mongodb://localhost/swot-home_test_auth_service_${Date.now()}`));

/**
 * Disconnect after all tests
 */
after(() => Mongoose.disconnect());

/**
 * Get a clean db for each test
 */
afterEach((done) => {

    Mongoose.connection.db.dropDatabase();
    done();
});

const manifest = {
    server: {},
    connections: [
        {
            port: 3000
        }
    ],
    registrations: [
        {
            plugin: {
                register: './'
            }
        }
    ]
};
const servOptions = { relativeTo: Path.join(__dirname, '../../') };

const getserver = function () {

    return Glue.compose(manifest, servOptions);
};

describe('auth.register', () => {

    it('should register a new user', { plan: 3 }, () => {

        const injection = {
            method: 'POST',
            url: '/register',
            payload: {
                name: 'u1',
                email: 'u1@leanhub.io',
                password: 'password'
            }
        };

        return getserver()
            .then((server) => server.inject(injection))
            .then((response) => {

                expect(response.statusCode).to.equal(HttpStatus.OK);
            })
            .then(() => User.find().exec())
            .then((userList) => {

                expect(userList).to.have.length(1);
                expect(userList[0].name).to.equal('u1');
            });
    });
});

describe('auth.login', () => {

    it('should register a new user', { plan: 2 }, () => {

        const injection1 = {
            method: 'POST',
            url: '/register',
            payload: {
                name: 'u1',
                email: 'u1@leanhub.io',
                password: 'password'
            }
        };

        const injection = {
            method: 'GET',
            url: '/login',
            headers: {
                authorization: `Basic ${(new Buffer('u1:password')).toString('base64')}`
            }
        };

        return getserver()
            .then((server) => server.inject(injection1))
            .then((response) => {

                expect(response.statusCode).to.equal(HttpStatus.OK);
            })
            .then(() => getserver())
            .then((server) => server.inject(injection))
            .then((response) => {

                expect(response.statusCode).to.equal(HttpStatus.OK);
            });
    });
});
