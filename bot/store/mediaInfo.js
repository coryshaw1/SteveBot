'use strict';
var sc = require(process.cwd() + '/bot/utilities/soundcloud.js');
var _ = require('lodash');

// TODO: move this to another file
var getSongLink = function(bot, callback){
  var media = bot.getMedia();

  if(!media) {
    return callback(null);
  }

  if(media.type.toUpperCase() === 'SOUNDCLOUD') {
    sc(bot, media, function(error, result){
      if (error) {
        return callback('https://api.dubtrack.fm/song/' + media.id + '/redirect');
      }
      return callback(_.get(result, 'permalink_url', null));
    });
  } else {
    return callback('http://www.youtube.com/watch?v=' + media.fkid);
  }
};

var mediaStore = {
  current : {
    link : null,
    name : null,
    id : null,
    type : null,
    dj : null,
    usersThatPropped : 0,
    usersThatFlowed : 0
  },

  last : {
    link : null,
    name : null,
    id : null,
    type : null,
    dj : null,
    usersThatPropped : 0,
    usersThatFlowed : 0
  },

  getCurrent : function(){
    return this.current;
  },

  getLast : function(){
    return this.last;
  },

  setLast : function(x) {
    if (typeof x === 'object') {
      for (var key in x) {
        if (this.last.hasOwnProperty(key) ) {
          this.last[key] = x[key];
        }
      }
    }
  },

  setCurrent : function(x) {
    if (typeof x === 'object') {
      for (var key in x) {
        if (this.current.hasOwnProperty(key) ) {
          this.current[key] = x[key];
        }
      }
    }
  },

  setCurrentKey: function(key, value){
    if (this.current.hasOwnProperty(key) ) {
      this.current[key] = value;
    }
  },

  getLink : getSongLink
};

module.exports = mediaStore;