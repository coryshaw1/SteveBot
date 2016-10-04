'use strict';
var settings = require(process.cwd() + '/private/settings.js');
var request = require('request');

// TODO: move this to another file
var getSongLink = function(bot, callback){
  var media = bot.getMedia();

  if(!media) {
    return callback();
  }

  if(media.type === 'soundcloud') {
    var options = {
      url: 'https://api.soundcloud.com/tracks/' + media.fkid + '.json?client_id=' + settings.SOUNDCLOUDID
    };

    var responseBack = function(error, response, body) {
      if(!error){
        try {
          var json = JSON.parse(body);
          return callback(json.permalink_url);
        } catch(e) {
          bot.log('error', 'BOT', 'Soundcloud API error fetching song! Could be caused by invalid Soundcloud API key');
          return callback('https://api.dubtrack.fm/song/' + media.id + '/redirect');
        }
      } else {
        bot.log('error', 'BOT', 'Soundcloud Error: ' + error);
        return callback('https://api.dubtrack.fm/song/' + media.id + '/redirect');
      }
    };

    request(options, responseBack);
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
        if (x.hasOwnProperty(key) ) {
          this.last[key] = x[key];
        }
      }
    }
  },

  setCurrent : function(x) {
    if (typeof x === 'object') {
      for (var key in x) {
        if (x.hasOwnProperty(key) && this.current.hasOwnProperty(key) ) {
          this.current[key] = x[key];
        }
      }
    }
  },

  getLink : getSongLink
};

module.exports = mediaStore;