/***************************************************************
 * This is fired when someone updubs or downdubs a song
 */

'use strict';

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistDub, function(data) {
    // console.log(data.dubtype);
  });
};
