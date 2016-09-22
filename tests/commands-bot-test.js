'use strict';

var chai = require('chai');
var expect = chai.expect;
// var should = chai.should;

// stubs for bot functions
var stubs = require('./stubs.js');

/* global describe, it */

describe('Bot Commands test', function(){

  it('!bot - should return a random item from responses array', function(done){
    var data = { user: { username: 'testUser' } };  
    var responses = [
      'I\'m still here!',
      '!human',
      'beep boop',
      'Hi @testUser!',
      'https://media.giphy.com/media/3o85xwc5c8DCoAF440/giphy.gif',
      'https://media.giphy.com/media/S0hxMGYFhEMzm/giphy.gif',
      'https://media.giphy.com/media/pIMlKqgdZgvo4/giphy.gif',
      'MUST KILL ALL HUM... sorry what was I talking about?',
      'So I says to Mable I says...'
    ];
    var test = require('../bot/commands/bot/bot.js')(stubs.bot, null, data);
    expect(responses).to.include(test);
    done();
  });

  it('!ping - should return !pong', function(done){
    var test = require('../bot/commands/bot/ping.js')(stubs.bot);
    expect(test).to.equal('pong!');
    done();
  });

  it('!thanks - should return You\'re Welcome', function(done){
    var test = require('../bot/commands/bot/thanks.js')(stubs.bot);
    expect(test).to.equal('You\'re welcome!');
    done();
  });

  it('!version - should return version number', function(done){
    var pkg = require(process.cwd() + '/package.json');
    var test = require('../bot/commands/bot/version.js')(stubs.bot);
    expect(test).to.equal('DerpyBot version: ' + pkg.version);
    done();
  });

  it('!sayhi - should respond in 4 ways', function(done){
    var currentTest = require('../bot/commands/bot/sayhi.js');
    var data = { 
      user: { username: 'testSender' },
      params : [ '@testUser' ]
    };

    // positive
    var x = currentTest(stubs.bot, null, data);
    expect(x).to.equal(`hi ${data.params[0]}, I'm DerpyBot!`);

    // improper format
    data.params = ['noAtSign'];
    x = currentTest(stubs.bot, null, data);
    expect(x).to.equal(`@${data.user.username}, use '!sayhi @[username]' to make the bot say hi to someone`);
    
    // can only say hi to one
    data.params.push('@anotherUser');
    x = currentTest(stubs.bot, null, data);
    expect(x).to.equal(`@${data.user.username} you can only say hi to one person`);

    // undefined
    data.params = undefined;
    x = currentTest(stubs.bot, null, data);
    expect(x).to.equal(`Say hi to who @${data.user.username}?`);

    done();
  });

});