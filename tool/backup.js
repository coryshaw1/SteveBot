#!/usr/bin/env node
'use strict';

/*************************************
  Back up our DB via Cron.  Mainly
  to backup triggers
*/

var firebase = require('firebase');
var settings = require('../private/settings.js');
var fbCreds  = require('../private/serviceAccountCredentials.json');
var fs = require('fs');

firebase.initializeApp({
  serviceAccount: fbCreds,
  databaseURL: settings.FIREBASE.BASEURL
});

var db = firebase.database();

db.ref().once('value', function(snapshot) {
  var val = snapshot.val();
  if (val !== null) {
    // save backups outside of the repo
    var loc = '../../derypbot-backups';
    fs.writeFileSync(`${loc}/backup-${Date.now()}.json`, JSON.stringify(val), 'utf8');
    process.exit();
  }
});