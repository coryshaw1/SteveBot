'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');

/**
 * Gives you info about the song that was just previously played
 * @param  {Object} bot  dubapi instance
 * @param  {Object} db   Firebase instance
 * @param  {Object} data Room info object
 */
module.exports = function(bot, db, data) {
  if(!data){ return;}
    var lastSong = mediaStore.getLast();

    if (!lastSong.name) {
        bot.sendChat('I haven\'t been here for an ending of a song!');
    } else{
      var msg = `@${data.user.username} The last song played was ${lastSong.name}, and the link is ${lastSong.link}`;
      bot.sendChat(msg);
    }
};

module.exports.extraCommands = ['lastsong', 'lasttrack'];