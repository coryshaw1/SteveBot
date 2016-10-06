'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var _ = require('lodash');

module.exports = function(bot, db, data) {
  if(!data) { return; }
  var current = mediaStore.getCurrent();


  var whoAsked = _.get(data, 'user.username', '');
  if (whoAsked !== ''){ 
    whoAsked = "@"+whoAsked;
  }

  if(!current.link) {
      bot.sendChat('No song is playing at this time!');
  } else{
      if (!current.link) {
        bot.sendChat('Sorry I couldn\'t get the link for this track for some reason');
      } else {
        bot.sendChat(`${whoAsked} The current song is ${current.name}, and the link is ${current.link}`);
      }
  }
};
