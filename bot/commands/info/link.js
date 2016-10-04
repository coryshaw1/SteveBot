'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');

module.exports = function(bot, db, data) {
  if(!data) { return; }
  var current = mediaStore.getCurrent();

  if(!current.link) {
      bot.sendChat('No song is playing at this time!');
  } else{
      bot.sendChat(`@${data.user.username} The current song is ${current.name}, and the link is ${current.link}`);
  }
};
