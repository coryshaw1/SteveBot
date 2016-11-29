'use strict';
var settings = require(process.cwd() + '/private/settings.js');
var config = require(process.cwd() + '/bot/config.js');
var Database = require(process.cwd() + '/bot/db.js');
var svcAcct = process.cwd() + '/private/serviceAccountCredentials.json';
var BASEURL = settings.FIREBASE.BASEURL;

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
  },
  myconfig : config
};

// when you require this you need to run the function in order
// to get the db instance started.
// var stubs = require('../path/to/stubs.js');
// var db = stubs.db();
var connectDB = function(){
  return new Database(svcAcct, BASEURL);
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