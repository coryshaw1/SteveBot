'use strict';
var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var usersInfo = require(process.cwd()+'/bot/utilities/users');

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistDub, function(data) {
    // console.log(data.dubtype);

  });
};
