'use strict';

var chai = require('chai');
var expect = chai.expect;

var stubs = require('./stubs.js');
var db = stubs.db;

/* global describe, it */
describe('Credit Commands test', function(){

  it('!balance - should return users point info as text', function(done){
    // var test = require(process.cwd() + '/bot/commands/credits/balance.js')(stubs.bot, db, stubs.data);
    // expect(test).to.equal('pong!');
    done();
  });

});