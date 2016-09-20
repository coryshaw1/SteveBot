'use strict';
var repo = require(process.cwd()+'/repo');

function displayHelp(bot){
  bot.sendChat('*usage:* !trigger <trigger_name> <trigger_text>');
  bot.sendChat('Don\'t add the "!" when creating a trigger');
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
  data.triggerText = data.params.slice(1).join(' ');

  repo.getTrigger(bot, db, data.triggerName, function(val){
    
    if (val === null && data.params.length > 1) {
      // creating a new trigger
      return repo.insertTrigger(db, data, function(){
        bot.sendChat(`trigger for *!${data.triggerName}* created, try it out!`);
      });
    }

    var keys;
    if (val !== null && data.params.length > 1) {
      // updating an existing trigger
      keys = Object.keys(val);
      return repo.updateTrigger(db, data, keys[0], function(){
        bot.sendChat(`trigger for *!${data.triggerName}* updated!`);
      });
    }

    if (val !== null && data.params.length === 1) {
      // deleting a trigger
      keys = Object.keys(val);
      return repo.deleteTrigger(db, keys[0], function(){
        bot.sendChat(`Trigger for *!${data.triggerName}* deleted`);
      });
    }


  });

};