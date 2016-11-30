'use strict';

/***********************************************************************
 * Add a song to a specific playlist
 **/

// location of the dubapi package
let loc = process.cwd() + '/node_modules/dubapi';
const endpoints = require(loc + '/lib/data/endpoints.js');

module.exports = function(playlistID, fkid, type, callback){
  /* jshint validthis:true */
  if (!this._.connected){ return false; }
  
  var url  = endpoints.userPlaylist.replace('%PID%',playlistID) + '/songs';

  var form = {fkid: fkid, type: type};

  this._.reqHandler.queue({method: 'POST', url: url, form: form}, callback);

  return true;
};