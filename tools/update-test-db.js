#!/usr/bin/env node
/**
 * Copy live db to test db
 * completely replaces test data
 * always only way one
 * Live -> test
 */

'use strict';
var fs = require('fs');
const moment = require('moment');
const admin = require("firebase-admin");

const timestamp = moment().format('MMM-D-YYYY-hmmss');

/**
 * Load production data into test db
 * @param {Object} val 
 */
function step2(val) {
  /** 
   * Test db setup
   */
  var testSettings = require('../private/test/settings.js');
  var svcAcct = require('../private/test/serviceAccountCredentials.json');
  var testApp =  admin.initializeApp({
    credential: admin.credential.cert(svcAcct),
    databaseURL: testSettings.FIREBASE.BASEURL
  });


  testApp.database().ref().set(val)
    .then(function(){
      console.log('test db updated completed successfully');

      testApp.delete()
        .then(function() {
          console.log("TestApp deleted successfully, exiting now");
          process.exit(0);
        })
        .catch(function(error) {
          console.log("Error deleting testApp:", error);
          process.exit(1);
        });

    })
    .catch(function(err){
      console.log(err);
      process.exit(1);
    });
}

/**
 * Make local JSON copy of the production db
 */
function step1() {
  /**
   * Production db setup
   */
  var settings = require('../private/prod/settings.js');
  var svcAcct = '../private/prod/serviceAccountCredentials.json';
  var prodApp =  admin.initializeApp({
    credential: admin.credential.cert(svcAcct),
    databaseURL: settings.FIREBASE.BASEURL
  });

  prodApp.database().ref().once('value', function(snapshot) {
    var val = snapshot.val();
    if (val !== null) {
      // save backups outside of the repo
      var loc = '.';
      console.log('making local backup');
      
      fs.writeFileSync(`${loc}/backup-${timestamp}.json`, JSON.stringify(val), 'utf8');
      
      if (val.song_issues) { delete val.song_issues; }
      if (val.song_stats) { delete val.song_stats; }
      
      prodApp.delete()
        .then(function() {
          console.log("App deleted successfully, running step2");
          step2(val);
        })
        .catch(function(error) {
          console.log("Error deleting app:", error);
          process.exit(1);
        });

    } else {
      console.log('Error during step1, val was null');
      process.exit(1);
    }
  });
}

step1();