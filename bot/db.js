'use strict';
var firebase = require('firebase');

module.exports = function Database(serviceAccount, BASEURL) {
  if (!serviceAccount || !BASEURL) {
    throw new Error("Missing databse credentials for Database");
  }
  
  firebase.initializeApp({
    serviceAccount: serviceAccount,
    databaseURL: BASEURL
  });

  return firebase.database();
};