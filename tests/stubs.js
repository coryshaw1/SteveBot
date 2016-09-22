'use strict';

var bot = {
  sendChat : function(x) { 
    return x; 
  }
};

// when you require this you need to run the function in order
// to get the db instance started.
// var stubs = require('../path/to/stubs.js');
// var db = stubs.db();
var connectDB = function(){
  var firebase = require('firebase');
  var settings = require('../private/settings.js');
  var fbCreds  = require('../private/serviceAccountCredentials.json');

  firebase.initializeApp({
    serviceAccount: fbCreds,
    databaseURL: settings.FIREBASE.BASEURL
  });

  return firebase.database();
};

module.exports = {
  bot : bot,
  db : connectDB
};