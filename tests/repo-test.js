'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should;

var repo = require(process.cwd()+'/repo');
var settings = require(process.cwd() + '/private/settings.js');
var firebase = require('firebase');
firebase.initializeApp({
  serviceAccount: process.cwd() + '/private/serviceAccountCredentials.json',
  databaseURL: settings.FIREBASE.BASEURL
});
var db = firebase.database();

// create a testData.js and put it in /private
// take a few users from the db and add them in an object replacing their
// IDs (keys) with user1, user2, etc...
var testData = require(process.cwd() + '/private/testData.js');

/* global describe, it, before, after */
describe('Firebase acccess tests', function(){
  var recipient  = testData.user1;

  before(function(done){
    var updateRef = db.ref('test/users').child(recipient.id);
    updateRef.update(recipient).then(function(){
      done();
    }).catch(function(err){
      console.log(err);
      done();
    });
  });
  
  it('Should add one prop point to user', function(done){
    repo.incrementUser(db, recipient, "props", function(user){
      if (user === null) { 
        console.log("error incrementing user"); 
        done();
      } else {
        expect(user.props).to.equal(1);
        done();
      }
    });
  });

  it('Should add one flow point to user', function(done){
    repo.incrementUser(db, recipient, "flow", function(user){
      if (user === null) { 
        console.log("error incrementing user"); 
        done();
      } else {
        expect(user.flow).to.equal(1);
        done();
      }
    });
  });

  it('Should find user by ID', function(done){

  });

  it('Should update user info', function(done){

  });

  it('Should insert new user data', function(done){

  });

  it('Should get top 3 leaders of points', function(done){

  });

  it('Should get trigger by triggerName', function(done){});

  it('Should update trigger by triggerName', function(done){});

  it('Should create trigger by triggerName', function(done){});

  it('Should delete trigger by triggerName', function(done){});

  it('Should insert a song issue', function(done){

  });

});