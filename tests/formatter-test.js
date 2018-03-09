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

// require our file to test
const triggerFormatter = require('../bot/utilities/trigger-formatter.js');

/* global it, describe */
describe('Trigger Formatter tests', function(){

  it('Should show the first argument', function(done){
    var text = "hello @%0|dj%";
    data.params = ['you'];
    var parsed = triggerFormatter(text, bot, data);
    expect(parsed).to.equal('hello @you');
    done();
  });

  it('only show the defaults', function(done){
    data.params = [];
    
    var text = "hello %0|dj%, do you know %1|me%, because %1|me% am %2|amazing%";
    var parsed = triggerFormatter(text, bot, data);
    expect(parsed).to.equal('hello testDJname, do you know testUser, because testUser am amazing');
    done();
  });
  

  it('Should show do replacement with all args given in order', function(done){
    var text = "%0% %1% %2% %3% %4% %5% %6% %7%";
    data.params = ['this', 'is', 'a', 'test', 'of', 'the', 'trigger', 'system'];
    var parsed = triggerFormatter(text, bot, data);
    expect(parsed).to.equal('this is a test of the trigger system');
    done();
  });

  it('mixing reserved words with interpolated n', function(done){
    var text = "hey you %dj%, %0% said to %me% that you suck";
    data.params = ["yoda"];
    var parsed = triggerFormatter(text, bot, data);
    expect(parsed).to.equal('hey you @testDJname, yoda said to testUser that you suck');
    done();
  });

  it('with and without reserved word defaults', function(done){
    var text = "hey %0|dj%, you are pretty %1|cool%";
    data.params = ["brad"];
    var parsed = triggerFormatter(text, bot, data);
    expect(parsed).to.equal('hey brad, you are pretty cool');
    
    data.params = ["brad", "dumb"];
    parsed = triggerFormatter(text, bot, data);
    expect(parsed).to.equal('hey brad, you are pretty dumb');

    done();
  });

  it('out of order in the text', function(done){
    var text = "%0% hated her %2% because it was full of %3% and %1%";
    data.params = ["sally", "bees", "head", "doodoo"];
    var parsed = triggerFormatter(text, bot, data);
    expect(parsed).to.equal('sally hated her head because it was full of doodoo and bees');
    done();
  });

  it('should get the correct spreadsheet data', function(done){
    var text = "%nmm.date% - %nmm.artist% - %nmm.album%";
    bot.sheetsData = bot.sheetsData || {};
    bot.sheetsData.nmm = {
      date : '3/12/2018',
      artist : 'Blockhead',
      album : 'Funeral Balloons'
    };
    var parsed = triggerFormatter(text, bot, data);
    expect(parsed).to.equal('3/12/2018 - Blockhead - Funeral Balloons');
    done();
  });

});