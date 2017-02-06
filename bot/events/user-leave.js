'use strict';

/**
 * When a user leaves, we don't really do anything so not sure why this is here
 * maybe just in case we need it in the future
 * @param  {Object} bot  Dubapi instance
 */
module.exports = function(bot) {
  bot.on(bot.events.userLeave, function(data) {
    var user = data.user;
    var info = `[LEAVE] ${user.username}`;
    bot.log('info', 'BOT', info);
  });
};