'use strict';
const dmStore = require(process.cwd()+ '/bot/store/messages.js');

module.exports = function(bot, db) {
  bot.on('new-message', function(data) {
    console.log(arguments);
    console.log(data);
  });
};