'use strict';
var request = require('request');
var _ = require('lodash');

/**
 * Allows you to run a callback function on each item in an array at whatever
 * pace you want.  It wraps it in a object where you can just call .next() to
 * run the callback on the next item in the array. 
 * @param {[type]}   arr [description]
 * @param {Function} cb  [description]
 */
function SlowIterator(arr, cb){
  var pos = 0;

  var next = function(){
    if (pos < arr.length) {
      cb(arr[pos], pos);
      pos++;
    }
  };

  return {
    next: next
  };
}

function makeRequestArray(roomID, pages) {
  var url = `https://api.dubtrack.fm/room/${roomID}/playlist/history?page=`;
  var result = [];
  for (var i=1; i <= pages; i++){
    result.push(url + i);
  }
  return result;
}

var historyStore = {
  songs : [],

  getSong : function(songid){
    if (!songid) { return; }

    var result = [];
    this.songs.forEach(function(song){
      if (song.songid === songid) {
        result.push(song);
      }
    });
    return result;
  },

  save : function(song){
    // add song to the beginning of the array
    this.songs.unshift(song);

    // keep array at a max length of 300
    if (this.songs.length > 300) {
      this.songs = this.songs.splice(299, this.songs.length - 1);
    }
  },

  clear : function(){
    this.songs = [];
  },

  init: function(bot, cb){
    var roomid = _.get(bot, '_.room.id');
    if (roomid) {
      this.clear();

      var self = this;
      var reqs = makeRequestArray(roomid, 5);
      var updateHistory = new SlowIterator(reqs.reverse(), function(current, pos){
        request.get(current, function(err, resp){
          if (err) {  
            console.log(err); 
          } else {
            self.songs = self.songs.concat(resp.data);
          }

          if (pos === reqs.length) {
            cb(self.songs);
          } else {
            updateHistory.next();
          }
          
        });
      });
      updateHistory.next();
    }
    
  }

};


module.exports = historyStore;