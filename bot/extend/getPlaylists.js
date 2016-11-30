'use strict';

/***********************************************************************
 * Get the bot's playlists
 **/

// location of the dubapi package
let loc = process.cwd() + '/node_modules/dubapi';
const endpoints = require(loc + '/lib/data/endpoints.js');

module.exports = function(callback){
  /* jshint validthis:true */
  if (!this._.connected){ return false; }
  
  var url  = endpoints.userPlaylists;

  this._.reqHandler.queue({method: 'GET', url: url}, callback);

  return true;
};