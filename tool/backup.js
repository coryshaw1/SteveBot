#!/usr/bin/env node
'use strict';
var fs = require('fs');
var Database = require('../bot/db.js');
var settings = require('../private/settings.js');
var svcAcct = '../private/serviceAccountCredentials.json';
var BASEURL = settings.FIREBASE.BASEURL;
var db = new Database(svcAcct, BASEURL);

/*************************************
  Back up our DB via Cron.  Mainly
  to backup triggers
*/


db.ref().once('value', function(snapshot) {
  var val = snapshot.val();
  if (val !== null) {
    // save backups outside of the repo
    var loc = '.';
    fs.writeFileSync(`${loc}/backup-${Date.now()}.json`, JSON.stringify(val), 'utf8');
    process.exit();
  }
});