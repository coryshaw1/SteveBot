'use strict';

/***********************************************************************
 * Get the bot's queue data
 **/

// location of the dubapi package
let loc = process.cwd() + '/node_modules/dubapi';
const endpoints = require(loc + '/lib/data/endpoints.js');
// adding new endpoint
endpoints.getUserQueue = 'room/%RID%/users/%UID%';

module.exports = function(userID, callback){
  /* jshint validthis:true */
  if (!this._.connected){ return false; }
  
  var url  = endpoints.getUserQueue.replace('%UID%', userID);

  this._.reqHandler.queue({method: 'GET', url: url}, callback);

  return true;
};