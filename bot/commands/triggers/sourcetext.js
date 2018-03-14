'use strict';
var repo = require(process.cwd()+'/repo');

/**
 * This grabs the text of a trigger and returns it as is without interpreting it
 * 
 * @param {Instance of DubAPI} bot 
 * @param {?} db 
 * @param {array} data 
 */
module.exports = function (bot, db, data) {
  if (data.params === void(0) || data.params.length < 1) {
    return bot.sendChat('*usage:* !sourcetext <trigger_name>');
  }

  if (data.params.length > 1) {
    bot.sendChat('only one trigger at a time');
    return bot.sendChat('*usage:* !sourcetext <trigger_name>');
  }

  var trigger = data.params[0];

  if (trigger.charAt(0) === '!') {
    trigger = trigger.substring(1);
  }

  repo.getTrigger(bot, db, trigger, function(val){
    if (val !== null){
      var keys = Object.keys(val);
      var result = val[keys[0]];
      if (result && result.Returns) {
        return bot.sendChat(`[${trigger}]: ${result.Returns}`);
      } else {
        return bot.sendChat('an error occured trying to find that trigger');
      }
    }
  });
};