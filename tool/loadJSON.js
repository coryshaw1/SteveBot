'use strict';
/* eslint no-console: 0 */
/************************************************************************

Load the Triggers data file and create new keys in Firebase
This is just in case we lost all the triggers  But Backs up should
be made as well

require:
make sure you update the dataFile location and name 

************************************************************************/

var dataFile = require('./temp.js');

var firebase = require('firebase');
var settings = require('../private/settings.js');
var fbCreds  = require('../private/serviceAccountCredentials.json');

firebase.initializeApp({
  serviceAccount: fbCreds,
  databaseURL: settings.FIREBASE.BASEURL
});

var db = firebase.database();


dataFile.forEach(function(el,i){
  db.ref('triggers').push().set({
    Author: el.Author,
    Returns: el.Returns,
    Trigger: el.Trigger
  }, function(err){
    if (err) { console.log(err);}
    
    if (i + 1 >=  dataFile.length) {
      setTimeout(function(){ process.exit(); }, 3000);
    }

  });
});


