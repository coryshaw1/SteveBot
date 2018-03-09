#!/usr/bin/env node
'use strict';
var fs = require('fs');
var Database = require('../bot/db.js');
const _private = require('../private/prod/settings.js');
var settings = _private.settings;
var svcAcct = _private.svcAcct;
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
    var loc = '../../Derpy-backups';
    fs.writeFileSync(`${loc}/backup-${Date.now()}.json`, JSON.stringify(val), 'utf8');
    process.exit();
  }
});