'use strict';
const Mongoose = require('mongoose');
const Code = require('code'); // assertion lib
const Lab = require('lab'); // test runner
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;

const User = require('../../lib/models/user.model');
const Service = require('../../lib/services/auth.service');

Mongoose.Promise = global.Promise; // Personal choice

/**
 * Connect once for all tests
 */
before(() => Mongoose.connect(`mongodb://localhost/swot-home_test_auth_service_${Date.now()}`));

beforeEach(() => {

    return User.ensureCustomIndexes();
});

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

describe('Register', () => {

    it('should register a new user', { plan: 4 }, () => {

        return Service.register({ name: 'u1', email: 'u1', password: 'p' })
            .then(() => User.findOne({ name: 'u1' }).exec())
            .then((user) => {

                expect(user).to.exist();
                expect(user.password).to.not.exist();
            })
            .then(() => User.findOne({ name: 'u1' }).select('password').exec())
            .then((user) => {

                expect(user.password).to.exist();
                expect(user.password.length).to.be.above(48);
            });
    });
});

describe('validateSimple', () => {

    it('should validateSimply a new user', { plan: 2 }, (done) => {

        Service.register({ name: 'u1', email: 'u1', password: 'p' })
            .then(() => {

                Service.validateSimple(null, 'u1', 'p', (err, auth) => {

                    expect(err).to.not.exist();
                    expect(auth).to.be.true();
                    done();
                });
            });
    });

    it('should not validateSimply a new user', { plan: 2 }, (done) => {

        Service.register({ name: 'u1', email: 'u1', password: 'p' })
            .then(() => {

                Service.validateSimple(null, 'u1', 'pq', (err, auth) => {

                    expect(err).to.exist();
                    expect(auth).to.be.false();
                    done();
                });
            });
    });

    it('should not validateSimply a new user', { plan: 2 }, (done) => {

        Service.register({ name: 'u1', email: 'u1', password: 'p' })
            .then(() => {

                Service.validateSimple(null, 'u12', 'pq', (err, auth) => {

                    expect(err).to.exist();
                    expect(auth).to.be.false();
                    done();
                });
            });
    });
});
