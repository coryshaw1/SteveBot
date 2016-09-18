'use strict';
var mediaInfo = require(process.cwd()+'/bot/utilities/media');

/**
 * Gives you info about the song that was just previously played
 * @param  {Object} bot  dubapi instance
 * @param  {Object} db   Firebase instance
 * @param  {Object} data Room info object
 */
module.exports = function(bot, db, data) {
  if(!data){ return;}

    if (!mediaInfo.lastMedia || !mediaInfo.lastMedia.currentName) {
        bot.sendChat('I haven\'t been here for an ending of a song!');
    } else{
      var msg = `@{data.user.username} The last song played was ${mediaInfo.lastMedia.currentName}, and the link is ${mediaInfo.lastMedia.currentLink}`;
      bot.sendChat(msg);
    }
};

module.exports.extraCommands = ['lastsong', 'lasttrack'];