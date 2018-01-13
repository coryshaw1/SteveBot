'use strict';
var roleChecker = require(process.cwd()+ '/bot/utilities/roleChecker.js');
var Verifier = require(process.cwd()+ '/bot/utilities/verify.js');

module.exports = function(bot, db, data) {
  if (typeof bot !== 'object' || typeof data !== 'object') {
    return;
  }

  // everything below this block is mod only action
  if ( !roleChecker(bot, data.user, 'mod') ) {
    bot.sendChat('Sorry only Mods and above can toggle a configuration');
    return;
  }

  // config item to toggle
  var item = data.params[0];

  if (!item) {
    bot.sendChat(`You must provide a config item to toggle. See full list here: http://franciscog.com/DerpyBot/commands/#config`);
    return;
  }

  if (typeof bot.myconfig[item] === "undefined") {
    bot.sendChat(`${item} is not a valid config item`);
    return;
  }

  if (typeof bot.myconfig[item] !== "boolean") {
    bot.sendChat(`You can only toggle true/false config items`);
    return;
  }

  // toggle that baby!
  bot.myconfig[item] = !bot.myconfig[item];
  bot.sendChat(`${item} is now set to *${bot.myconfig[item]}*. Note: this will reset if the bot reboots`);
};