'use strict';
var admin = require("firebase-admin");

module.exports = function Database(serviceAccount, BASEURL) {
  if (!serviceAccount || !BASEURL) {
    throw new Error("Missing databse credentials for Database");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: BASEURL
  });

  return admin.database();
};