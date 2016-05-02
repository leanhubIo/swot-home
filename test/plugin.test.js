'use strict';
const Code = require('code'); // assertion lib
const Lab = require('lab'); // test runner
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const Glue = require('glue');
const Path = require('path');

describe('Plugin', () => {

    it('should register to a server', { plan: 1 }, () => {

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
        const servOptions = { relativeTo: Path.join(__dirname, '../') };

        return Glue.compose(manifest, servOptions)
            .then((server) => {

                expect(server).to.exist();
            });
    });
});
