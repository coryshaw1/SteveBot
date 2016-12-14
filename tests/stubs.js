'use strict';
var settings = require(process.cwd() + '/private/test-settings.js');
var config = require(process.cwd() + '/bot/config.js');
var Database = require(process.cwd() + '/bot/db.js');
var svcAcct = process.cwd() + '/private/TESTserviceAccountCredentials.json';
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
  myconfig : config,
  commandedToDJ : false,
  isDJing : false
};

// need different kind of data responses
// 1. one without any params
// 2. one with params but just 1 item in the array
// 3. one with more items in the array
// 4. one without username
var dataResponse = {};

module.exports = {
  bot : bot,
  db : new Database(svcAcct, BASEURL),
  data : dataResponse
};