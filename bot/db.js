'use strict';
const admin = require("firebase-admin");

/**
 * 
 * @param {string} serviceAccount 
 * @param {string} BASEURL 
 * @param {string} [optionalAppName] 
 * @returns 
 */
module.exports = function database(serviceAccount, BASEURL, optionalAppName) {
  if (!serviceAccount || !BASEURL) {
    throw new Error("Missing databse credentials for Database");
  }

  // returns an instances of admin.app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: BASEURL
  }, optionalAppName);

  return admin.database();
};