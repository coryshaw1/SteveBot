'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var repo = require(process.cwd()+'/repo.js');
var stubs = require('./stubs.js');
var db = stubs.db;
var bot = stubs.bot;

var triggers = require( process.cwd() + '/bot/utilities/triggers.js');

// create a testData.js and put it in /private
// take a few users from the db and add them in an object replacing their
// IDs (keys) with user1, user2, etc...
var testData = require(process.cwd() + '/private/testData.js');

/* global describe, it, before, after */
describe("Trigger tests", function(){
  var testUser1  = testData.user1;
  var testTriggerKey = null;

  before(function(done){
    repo.getTrigger(bot, db, 'test', function(val){
      var keys = Object.keys(val);
      testTriggerKey = keys[0];
      console.log(testTriggerKey);
      done();
    });
  });

  it('Should append to an existing trigger', function(done){
    var data = {};
    data.trigger = 'test';
    data.user = testUser1;
    data.triggerAppend = "this is more text";
    triggers.append(bot, db, data, function(err){
      if (err) {
        done(err);
      }
      repo.getTrigger(bot, db, 'test', function(val){
        var keys = Object.keys(val);
        var theReturn = val[keys[0]].Returns;
        expect(theReturn).to.equal('this is a test 2 this is more text');
        done();
      });
    });
  });

  // reset our trigger back to its origin state
  after(function(done){
    var data = {};
    data.triggerName = 'test';
    data.triggerText = 'this is a test 2';
    data.user = testUser1;

    repo.updateTrigger(db, data, testTriggerKey)
      .then(function(err){
        if (err) {
          console.log("err in update " + err.code );
          done();
        }

        db.ref('triggers/' + testTriggerKey).once('value')
          .then(function(snapshot){
            done();
          })
          .catch(function(_err){
            console.log("err in after->update->find " + _err.code );
            done();
          });

      })
      .catch(function(err){
        console.log("err in update " + err.code );
        done();
      });
  });
});