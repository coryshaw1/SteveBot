'use strict';
var repo = require(process.cwd()+'/repo');

function displayHelp(bot){
  bot.sendChat('*usage:* !erase <trigger_name>');
  bot.sendChat('Don\'t add the "!" when erasing a trigger');
}

module.exports = function(bot, db, data) {
  if (data.params === void(0) || data.params.length < 1) {
    return displayHelp(bot);
  }

  // if not a MOD, GTFO!
  if ( !bot.hasPermission(bot.getUserByName(data.user.username), 'skip') ) {
    return bot.sendChat('Ah ah ah, not without the magic word! (only mods can do this)');
  }

  if (data.params[0].charAt(0) === '!') {
    displayHelp(bot);
    return;
  }

  data.triggerName = data.params[0];

  repo.getTrigger(bot, db, data.triggerName, function(val){

    if (val !== null && data.params.length === 1) {
      // deleting a trigger
      bot.sendChat('Trigger erase functionality is coming soon');
      return;
    }

  });

};