'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should;

var repo = require(process.cwd()+'/repo');
var stubs = require('./stubs.js');
var db = stubs.db();

// create a testData.js and put it in /private
// take a few users from the db and add them in an object replacing their
// IDs (keys) with user1, user2, etc...
var testData = require(process.cwd() + '/private/testData.js');

/* global describe, it, before, after */
describe('Firebase acccess tests', function(){
  var testUser1  = testData.user1;

  before(function(done){
    var updateRef = db.ref('test/users').child(testUser1.id);
    updateRef.update(testUser1).then(function(){
      var killUser = db.ref('test/users').child("111000");
      killUser.set(null, function(err){
        done();
      });
    }).catch(function(err){
      console.log(err);
      done();
    });
  });
  
  it('Should add one prop point to user', function(done){
    repo.incrementUser(db, testUser1, "props", function(user){
      expect(user.props).to.equal(1);
      done();
    });
  });

  it('Should add one flow point to user', function(done){
    repo.incrementUser(db, testUser1, "flow", function(user){
      expect(user.flow).to.equal(1);
      done();
    });
  });

  it('Should find user by ID', function(done){
    repo.findUserById(db, testUser1.id, function(user){
      expect(user.flow).to.equal(1);
      expect(user.username).to.equal(testUser1.username);
      expect(user).to.be.a("object");
      done();
    });
  });

  it('Should update user info', function(done){
      var newdata = {
        'dubs': 100,
        'flow' : 300,
        'props' : 2
      };
    repo.updateUser(db, testUser1.id, newdata, function(result){
      repo.findUserById(db, testUser1.id, function(user){
        expect(user.flow).to.equal(300);
        expect(user.dubs).to.equal(100);
        expect(user.props).to.equal(2);
        done();
      });
    });
  });

  it('Should insert new user data', function(done){
    var newUser = {
      'dubs': 500,
      'id' : "111000",
      "username": "stupidface"
    };
    repo.insertUser(db, newUser, function(result){
      repo.findUserById(db, "111000", function(user){
        expect(user.flow).to.equal(0);
        expect(user.dubs).to.equal(500);
        expect(user.props).to.equal(0);
        expect(user.username).to.equal("stupidface");
        done();
      });
    });
  });

  it('Should get top 3 flow leaders of points', function(done){
    repo.getLeaders(db, "flow", 3, function(items){
      expect(items).to.be.a('object');
      expect(items[testUser1.id].flow).to.equal(300);
      done();
    });
  });

  // it('Should get trigger by triggerName', function(done){});

  // it('Should update trigger by triggerName', function(done){});

  // it('Should create trigger by triggerName', function(done){});

  // it('Should delete trigger by triggerName', function(done){});

  // it('Should insert a song issue', function(done){

  // });

});