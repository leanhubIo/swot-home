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

describe('user.me', () => {

    it('should find himself', { plan: 2 }, () => {

        const user = new User({ name: 'u@', email: 'u@', password: 'u1', token: 't' });

        const injection = {
            method: 'GET',
            url: '/users/me',
            headers: {
                authorization: 'Bearer t'
            }
        };

        return user.save()
            .then(() => getserver())
            .then((server) => server.inject(injection))
            .then((response) => {

                expect(response.statusCode).to.equal(HttpStatus.OK);
                return JSON.parse(response.payload);
            })
            .then((payload) => {

                expect(payload._id + '').to.equal(user._id + '');
            });
    });
});

describe('user.read', () => {

    it('should find another self', { plan: 4 }, () => {

        const user = new User({ name: 'u@', email: 'u@', password: 'u1', token: 't' });

        const injection = {
            method: 'GET',
            url: '/users/' + user._id,
            headers: {
                authorization: 'Bearer t'
            }
        };

        return user.save()
            .then(() => getserver())
            .then((server) => server.inject(injection))
            .then((response) => {

                expect(response.statusCode).to.equal(HttpStatus.OK);
                return JSON.parse(response.payload);
            })
            .then((payload) => {

                expect(payload._id + '').to.equal(user._id + '');
                expect(payload.password).to.not.exist();
                expect(payload.email).to.not.exist();
            });
    });
});

describe('user.list', () => {

    it('should find users', { plan: 6 }, () => {

        const user = new User({ name: 'u@', email: 'u@', password: 'u1', token: 't' });
        const user2 = new User({ name: '2ua3', email: 'ua', password: 'u1', token: 't2' });

        const injection = {
            method: 'GET',
            url: '/users?name=ua',
            headers: {
                authorization: 'Bearer t'
            }
        };

        return Promise.all([user.save(), user2.save()])
            .then(() => getserver())
            .then((server) => server.inject(injection))
            .then((response) => {

                expect(response.statusCode).to.equal(HttpStatus.OK);
                return JSON.parse(response.payload);
            })
            .then((payload) => {

                expect(payload).to.be.an.array();
                expect(payload).to.have.length(1);
                expect(payload[0]._id + '').to.equal(user2._id + '');
                expect(payload[0].password).to.not.exist();
                expect(payload[0].email).to.not.exist();
            });
    });
});
