'use strict';
var pkg = require(process.cwd() + '/package.json');

/**
 * Displays the current version of the bot listed inthe pacakge.json
 * @param  {Object} bot Dubapi instance
 */
module.exports = function(bot) {
    bot.sendChat('DerpyBot version: ' + pkg.version);
};

module.exports.extraCommands = ['v', 'ver'];