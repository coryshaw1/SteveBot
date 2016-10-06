'use strict';
var settings = require(process.cwd() + '/private/settings.js');
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var request = require('request');
var _ = require('lodash');

function getSCjson(bot, media, callback) {
  if (!bot || !media) { return; }
  
  if (typeof callback !== 'function') {
    callback = function(){};
  }

  if (!media.fkid){ return callback(null); }

  var options = {
    url: `https://api.soundcloud.com/tracks/${media.fkid}.json?client_id=${settings.SOUNDCLOUDID}`
  };

  var responseBack = function(error, response, body) {
    if(error){
      bot.log('error', 'BOT', 'Soundcloud Error: ' + error);
      return callback(error, null);
    }

    try {
      var json = JSON.parse(body);
      return callback(null, json);
    } catch(e) {
      bot.log('error', 'BOT', 'Soundcloud API error fetching song! Could be caused by invalid Soundcloud API key');
      return callback(e, null);
    }

  };

  request(options, responseBack);
}

// for testing by calling the file directly via command line
if (process.env.LOCAL) {
  var bot = {};
  bot.log = function(x){};
  var media = {fkid: process.env.LOCAL};
  var callback = function(x,y){console.log(x,y);};
  getSCjson(bot, media, callback);
}


module.exports = getSCjson;