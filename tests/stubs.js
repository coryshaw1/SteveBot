'use strict';
var firebase = require('firebase');
var settings = require(process.cwd() + '/private/settings.js');
firebase.initializeApp({
  serviceAccount: process.cwd() + '/private/serviceAccountCredentials.json',
  databaseURL: settings.FIREBASE.BASEURL
});

/**
 * [bot description]
 * @type {Object}
 */
var bot = {
  sendChat : function(x) { 
    return x; 
  }, 
  getDJ : function() {
    // return DJ info object
  },
  getMedia : function() {
    // return a media object
  },
  updub : function() {
    return; // do nothing
  },
  getUsers : function() {
    // return list of users
  },
  on : function(event, callback) {
    // probably do nothing during testing
  },
  log : function(x,y,z) {
    console.log('TEST',x,y,z);
  }
};

// when you require this you need to run the function in order
// to get the db instance started.
// var stubs = require('../path/to/stubs.js');
// var db = stubs.db();
var connectDB = function(){
  return firebase.database();
};

// need different kind of data responses
// 1. one without any params
// 2. one with params but just 1 item in the array
// 3. one with more items in the array
// 4. one without username
var dataResponse = {};

module.exports = {
  bot : bot,
  db : connectDB,
  data : dataResponse
};