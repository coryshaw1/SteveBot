#!/usr/bin/env node
/**
 * Copy live db to test db
 * completely replaces test data
 * always only way one
 * Live -> test
 */

'use strict';
var fs = require('fs');
var Database = require('../bot/db.js');
var svcAcct = '../private/serviceAccountCredentials.json';
const moment = require('moment');

/**
 * Production db setup
 */
var settings = require('../private/settings.js');
var BASEURL = settings.FIREBASE.BASEURL;
var dbProd = new Database(svcAcct, BASEURL);

/** 
 * Test db setup
 */
var testSettings = require('../private/test/settings.js');
var testBASEURL = testSettings.FIREBASE.BASEURL;
var dbTest = new Database(svcAcct, testBASEURL, 'test');



/*************************************
  Back up our DB via Cron.  Mainly
  to backup triggers
*/

const timestamp = moment().format('MMM-D-YYYY-hmmss');

dbProd.ref().once('value', function(snapshot) {
  var val = snapshot.val();
  if (val !== null) {
    // save backups outside of the repo
    var loc = '.';
    console.log('making local backup');
    
    fs.writeFileSync(`${loc}/backup-${timestamp}.json`, JSON.stringify(val), 'utf8');
    
    if (val.song_issues) { delete val.song_issues; }
    if (val.song_stats) { delete val.song_stats; }
    
    // dbTest.ref().set(val)
    //   .then(function(){
    //     console.log('completed successfully');
    //     process.exit(0);
    //   })
    //   .catch(function(err){
    //     console.log(err);
    //     process.exit(1);
    //   });
  }
});