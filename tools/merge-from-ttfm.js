#!/usr/bin/env node
"use strict";
const fs = require("fs");
const Database = require("../bot/db.js");
const settings = require("../private/prod/settings.js");
const svcAcct = require("../private/prod/serviceAccountCredentials.json");
const repo = require('../repo.js')

const BASEURL = settings.FIREBASE.BASEURL;
const db = new Database(svcAcct, BASEURL);
const { triggers } = require(process.argv[2]);

function getTrigger(db, trigger) {
  return new Promise((resolve) => {
    repo.getTrigger(null, db, trigger, resolve);
  });
}

async function main() {
  for (const triggerKey of Object.keys(triggers)) {
    const triggerValue = triggers[triggerKey];

    // look if a trigger with the same name exists
    const foundTrigger = await getTrigger(db, triggerKey);
    
    if (foundTrigger) {
      // if it does, we replace it wiith the one from ttg.fm because that takes precedence
      const data = {
        triggerName: triggerKey,
        triggerText: triggerValue,
      }
      await repo.updateTrigger(db, data, triggerKey)
    } else {
      // trigger doesn't exist, create it
     
    }
  }
  process.exit(0);
}

main()
  .catch(console.error)
  .then(() => process.exit(1));
