'use strict';
var settings = require(process.cwd() + '/private/settings.js');
var request = require('request');

function skipIt(bot){
  var dj = bot.getDJ().username || null;
  if (!dj) { dj = '@'+dj; }

  return bot.moderateSkip(function(){
    bot.sendChat(`Sorry ${dj}, this SoundCloud song is broken`);
  });

}

module.exports = function(bot, scID) {
  if (!bot || !scID) { return; }

  var options = {
    url: `https://api.soundcloud.com/tracks/${scID}.json?client_id=${settings.SOUNDCLOUDID}`
  };

  var responseBack = function(error, response, body) {
    if(!error){

      try {
        var json = JSON.parse(body);
        return json;
      } catch(e) {
        bot.log('error', 'BOT', 'Soundcloud API error fetching song! Could be caused by invalid Soundcloud API key');
        skipIt(bot);
      }

    } else {
      bot.log('error', 'BOT', 'Soundcloud Error: ' + error);
    }
  };

  request(options, responseBack);
};