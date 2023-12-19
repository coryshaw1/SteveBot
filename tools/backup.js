#!/usr/bin/env node
'use strict';
const fs = require('fs');
const Database = require('../bot/db.js');
const settings = require('../private/prod/settings.js');
const svcAcct = require('../private/prod/serviceAccountCredentials.json')

const BASEURL = settings.FIREBASE.BASEURL;
const db = new Database(svcAcct, BASEURL);

/*************************************
  Back up our DB via Cron.  Mainly
  to backup triggers
*/


db.ref().once('value', function(snapshot) {
  var val = snapshot.val();
  if (val !== null) {
    // save backups outside of the repo
    var loc = '../../backups';
    fs.writeFileSync(`${loc}/backup-${Date.now()}.json`, JSON.stringify(val), 'utf8');
    process.exit();
  }
});