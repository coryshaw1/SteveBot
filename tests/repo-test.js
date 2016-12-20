'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should;

var repo = require(process.cwd()+'/repo');
var stubs = require('./stubs.js');
var db = stubs.db;
var bot = stubs.bot;

// create a testData.js and put it in /private
// take a few users from the db and add them in an object replacing their
// IDs (keys) with user1, user2, etc...
var testData = require(process.cwd() + '/private/testData.js');

/* global describe, it, before, after */
describe('Firebase acccess tests', function(){
  var testUser1  = testData.user1;

  before(function(done){
    var eraseUser = db.ref('test/users/'+testUser1.id);
    eraseUser.remove()
      .then(function(){
        done();
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message);
      });
  });
  
  it('Should log user as a new user', function(done){
    repo.logUser(db, testUser1, function(user){
      expect(user.logType).to.equal("inserted");
      expect(user.props).to.equal(0);
      done();
    });
  });

  it('Should log user as a updated user', function(done){
    testUser1.dubs = 51000;
    repo.logUser(db, testUser1, function(user){
      expect(user.logType).to.equal("updated");
      expect(user.dubs).to.equal(51000);
      done();
    });
  });

  it('Should add one prop point to user', function(done){
    repo.incrementUser(db, testUser1, "props", function(user){
      expect(user).to.be.a("object");
      expect(user.props).to.equal(1);
      done();
    });
  });

  it('Should add one flow point to user', function(done){
    repo.incrementUser(db, testUser1, "flow", function(user){
      expect(user).to.be.a("object");
      expect(user.flow).to.equal(1);
      done();
    });
  });

  it('Should find user by ID', function(done){
    repo.findUserById(db, testUser1.id, function(user){
      expect(user.username).to.equal(testUser1.username);
      expect(user).to.be.a("object");
      done();
    });
  });
});

describe("Firebase Trigger test", function(){

  var testTriggerKey = null;
  it('Should get trigger by triggerName', function(done){
    repo.getTrigger(bot, db, 'test', function(val){
      var keys = Object.keys(val);
      testTriggerKey = keys[0];
      var theReturn = val[testTriggerKey].Returns;
      expect(theReturn).to.equal('this is a test 2');
      done();
    });
  });

  it('Should update trigger by triggerName', function(done){
    var data = {};
    data.triggerName = 'test';
    data.triggerText = 'I am the new thing';
    data.user = { username: 'person' };

    repo.updateTrigger(db, data, testTriggerKey)
      .then(function(err){
        if (err) {
          should.not.exist(err);
          console.log("err in update " + err.code );
          done();
        }

        db.ref('triggers/' + testTriggerKey).once('value')
          .then(function(snapshot){
            var val = snapshot.val();
            expect(val.Returns).to.equal('I am the new thing');
            done();
          })
          .catch(function(_err){
            should.not.exist(_err);
            console.log("err in update->find " + _err.code );
            done();
          });

      })
      .catch(function(err){
        should.not.exist(err);
        console.log("err in update " + err.code );
        done();
      });
  });

  it('Should delete trigger by trigger key', function(done){
    repo.deleteTrigger(db, testTriggerKey)
      .then(function(){
        db.ref('triggers/' + testTriggerKey).once('value')
          .then(function(snap){
            should.not.exist(snap.val());
            done();
          })
          .catch(function(err){
            should.not.exist(err);
            console.log("err in find " + err.code );
            done();
          });
      })
      .catch(function(err){
        should.not.exist(err);
        console.log("err in delete " + err.code );
        done();
      });
  });

  it('Should create trigger by triggerName', function(done){
    var data = {};
    data.triggerName = 'test';
    data.triggerText = 'this is a test 2';
    data.user = { username: 'person' };
    repo.insertTrigger(db, data)
      .then(function(){
        repo.getTrigger({}, db, 'test', function(val){
            var keys = Object.keys(val);
            var theReturn = val[keys[0]].Returns;
            expect(theReturn).to.equal('this is a test 2');
            done();
          });
      })
      .catch(function(err){
        should.not.exist(err);
        console.log("err in create " + err.code );
        done();
      });
  });

  
});