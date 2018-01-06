'use strict';
const setTimeout = require('timers').setTimeout;

module.exports = function(bot, db) {
  bot.on('disconnected', function(data) {
    bot.isConnected = false;
    bot.log('info', 'BOT', `Disconnected from ${data}`);
    // try reconnecting after 15 seconds
    // the long timer is to let the onExit functions fire first just in case
    setTimeout(bot.reconnect, 15000);
  });
};