'use strict';
var admin = require("firebase-admin");

module.exports = function Database(serviceAccount, BASEURL, optionalAppName) {
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