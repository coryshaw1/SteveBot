/***********************************************************************
 * Shuffle playlist
 **/

'use strict';
// location of the dubapi package
let loc = process.cwd() + '/node_modules/dubapi';
const endpoints = require(loc + '/lib/data/endpoints.js');


endpoints.shufflePlaylist = 'playlist/%PID%/order/randomize';  // POST

module.exports = function(playlistID,  callback){
  /* jshint validthis:true */
  if (!this._.connected){ return false; }
  
  var url  = endpoints.shufflePlaylist.replace('%PID%',playlistID);

  this._.reqHandler.queue({method: 'POST', url: url}, callback);

  return true;
};

