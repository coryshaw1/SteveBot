'use strict';
module.exports = function(bot, db) {
  bot.sendChat(`Check out all of the commands here: ${bot.myconfig.commands}`);
};

module.exports.extraCommands = ['help'];
