'use strict';
const HttpStatus = require('http-status-codes'); // list of HTTP status
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
const Service = require('../../lib/services/user.service');

Mongoose.Promise = global.Promise; // Personal choice

/**
 * Connect once for all tests
 */
before(() => Mongoose.connect(`mongodb://localhost/swot-home_test_user_service_${Date.now()}`));

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

describe('List', () => {

    it('should list all the users', { plan: 2 }, () => {

        const users = [1,2,3].map((i) => new User({ name: `u${i}`, email: `u${i}`, password: `u${i}` }));
        const saveAll = users.map((usr) => usr.save());

        return Promise.all(saveAll)
            .then(() => Service.list())
            .then((userList) => {

                expect(userList).to.be.an.array();
                expect(userList).to.have.length(3);
            });
    });

    it('should list all the users whose name contains \'3\'', { plan: 3 }, () => {

        const users = [1,2,3].map((i) => new User({ name: `u${i}`, email: `u${i}`, password: `u${i}` }));
        const saveAll = users.map((usr) => usr.save());

        return Promise.all(saveAll)
            .then(() => Service.list('3'))
            .then((userList) => {

                expect(userList).to.be.an.array();
                expect(userList).to.have.length(1);
                expect(userList[0].name).to.equal('u3');
            });
    });
});

describe('Save', () => {

    it('should save a new user', { plan: 5 }, () => {

        const i = 1;
        return Service.save({ name: `u${i}`, email: `u${i}`, password: `u${i}` })
            .then((user) => {

                expect(user).to.exist();
                expect(user.password).to.equal('');
            })
            .then(() => User.find().exec())
            .then((userList) => {

                expect(userList).to.be.an.array();
                expect(userList).to.have.length(1);
                expect(userList[0].name).to.equal('u1');
            });
    });

    it('should not save a new user due to conflict on name', { plan: 4 }, () => {

        const user = new User({ name: 'u1', email: 'u@', password: 'u1' });

        return user.save()
            .then(() => Service.save({ name: 'u1', email: 'u1', password: 'u1' }))
            .catch((err) => {

                expect(err).to.exist();
                expect(err.output.statusCode).to.equal(HttpStatus.CONFLICT);
            })
            .then(() => User.find().exec())
            .then((userList) => {

                expect(userList).to.be.an.array();
                expect(userList).to.have.length(1);
            });
    });

    it('should not save a new user due to conflict on email', { plan: 4 }, () => {

        const user = new User({ name: 'u@', email: 'u1', password: 'u1' });

        return user.save()
            .then(() => Service.save({ name: 'u1', email: 'u1', password: 'u1' }))
            .catch((err) => {

                expect(err).to.exist();
                expect(err.output.statusCode).to.equal(HttpStatus.CONFLICT);
            })
            .then(() => User.find().exec())
            .then((userList) => {

                expect(userList).to.be.an.array();
                expect(userList).to.have.length(1);
            });
    });

    it('should not save a new user due to conflict on tokens', { plan: 4 }, () => {

        const user = new User({ name: 'u@', email: 'u@', password: 'u1', token: 't' });

        return user.save()
            .then(() => Service.save({ name: 'u1', email: 'u1', password: 'u1', token: 't' }))
            .catch((err) => {

                expect(err).to.exist();
                expect(err.output.statusCode).to.equal(HttpStatus.CONFLICT);
            })
            .then(() => User.find().exec())
            .then((userList) => {

                expect(userList).to.be.an.array();
                expect(userList).to.have.length(1);
            });
    });
});

