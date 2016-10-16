'use strict';
const _ = require('lodash');

/***********************************************************************
 * Stubs for parts of DubAPI
 **/

var endpoints = {
  roomPlaylistHistory : 'room/%RID%/playlist/history?page=%PAGENUM%'
};

function DubAPIRequestError(code, endpoint) {
    Error.captureStackTrace(this);
    this.name = 'DubAPIRequestError';
    this.message = 'Response ' + code + ' from ' + endpoint;
}

DubAPIRequestError.prototype = Object.create(Error.prototype);

/************************************************************************/

/**
 * Allows you to run a callback function on each item in an array at whatever
 * pace you want.  It wraps it in a object where you can just call .next() to
 * run the callback on the next item in the array. 
 * @param {[type]}   arr [description]
 * @param {Function} cb  [description]
 */
function StepIterator(arr, cb){
  var pos = 0;
  var doneCB = function(){};

  var next = function(){
    if (pos < arr.length) {
      cb(arr[pos], pos);
      pos++;
    } else {
      doneCB();
    }
  };

  var done = function(cb){
    doneCB = cb;
  };

  next();

  return {
    next: next,
    done: done
  };
}

function makeRequestArray(roomID, pages) {
  var url = endpoints.roomPlaylistHistory.replace('%RID%', roomID);
  var result = [];
  for (var i=1; i <= pages; i++){
    result.push(url.replace('%PAGENUM%', i));
  }
  return result;
}


function getRoomHistory(pages, callback){
  if (!this._.connected) return false;

  // get room id
  var roomid = _.get(this, '_.room.id');

  if (!roomid) return false;

  // make an array of urls to iterate requests
  var reqs = makeRequestArray(roomid, pages);

  // store the history to be returned at the end
  var history = [];

  var that = this;

  // begin our requests and build our playlist history array
  var getHistory = new StepIterator(reqs, function(current, pos){
    
    that._.reqHandler.queue({method: 'GET', url: current}, function(code, body) {
      if (code !== 200) {
        that.emit('error', new DubAPIRequestError(code, current));
      } else {
        history = history.concat(body.data);
      }
      getHistory.next();
    });

  });

  getHistory.done(function(){
    if (typeof callback === 'function') {
      callback(history);
    }
  });
  
}


module.exports = getRoomHistory;
