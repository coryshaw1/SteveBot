'use strict';
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

// stubs for bot functions
const stubs = require('./stubs.js');
const bot = stubs.bot;

// DJ = testDJname;
const data = {
  user: { username: 'testUser' }
};

/*
IDs of confirmed broken songs
87380722 - 404 rror 
116534641 - null
54816877 - null
226913338 - 404 error
80963599 - 404 error
270048143 - 404 error

IDs of working sonds (as of May 2018)
223456028 - Mz Boom Bap - Fast Life (Instrumental)
*/

// require our file to test
const sc = require('../bot/utilities/soundcloud.js');

/* global it, describe */
describe('Soundcloud track info tests', function(){

  it('Should successfully connect to soundcloud', function(done){
    var media = {fkid: 123456789, name: 'not a real track' };
    sc(bot, media, function(error, result){
      expect(error).to.be.null;
      expect(result).to.not.be.null;
      done();
    });
  });

  it('Missing bot argument should return undefined', function(done){
    expect(sc()).to.be.undefined;
    done();
  });

  it('Missing callback argument should return undefined', function(done){
    expect( sc(bot) ).to.be.undefined;
    done();
  });

  it('Should return an error message when media object is missing', function(done){
    sc(bot, null, function(error, result){
      expect(result).to.be.null;
      expect(error.error_message).to.be.string;
      expect(error.error_message).to.equal('soundcloud getSCjson: missing media object');
      done();
    });
  });

  it('Should return an error message when song ID is missing', function(done){
    sc(bot, {}, function(error, result){
      expect(result).to.be.null;
      expect(error.error_message).to.be.string;
      expect(error.error_message).to.equal('soundcloud getSCjson: missing song id');
      done();
    });
  });

  it('Should return a 404 for made-up id', function(done){
    var media = {fkid: 111111111111111, name: 'not a real track' };

    sc(bot, media, function(error, result){
      expect(error).to.be.null;
      // { errors: [ { error_message: '404 - Not Found' } ] }
      expect(Array.isArray(result.errors)).to.be.true;
      expect(result.errors[0].error_message).to.equal('404 - Not Found');
      done();
    });
  });

  it('Should return a 404 for a confirmed broken id', function(done){
    var media = {fkid: 87380722, name: 'Chamber Of Secrets' };

    sc(bot, media, function(error, result){
      expect(error).to.be.null;
      expect(Array.isArray(result.errors)).to.be.true;
      expect(result.errors[0].error_message).to.equal('404 - Not Found');
      done();
    });
  });

  it('Body should be null for api forbidden track', function(done){
    var media = {fkid: 116534641, name: 'The Other Side - Help Me (FilososfischeStilte Remix)' };

    sc(bot, media, function(error, result){
      expect(error).to.be.null;
      expect(result).to.be.null;
      done();
    });
  });

  it('Body should be null for api forbidden track', function(done){
    var media = {fkid: 54816877, name: 'Morning in Japan' };

    sc(bot, media, function(error, result){
      expect(error).to.be.null;
      expect(result).to.be.null;
      done();
    });
  });

  it('Should successfully return track ino', function(done){
    var media = {fkid: 223456028, name: 'Mz Boom Bap - Fast Life (Instrumental)' };

    sc(bot, media, function(error, result){
      expect(error).to.be.null;
      expect(result.id).to.equal(223456028);
      expect(result.kind).to.equal('track');
      done();
    });
  });

});