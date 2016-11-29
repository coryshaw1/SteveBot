'use strict';
var repo = require(process.cwd()+'/repo');

function findTrigger(bot, db, data) {
  if (data.params === void(0) || data.params.length < 1) {
    return bot.sendChat('*usage:* !source <trigger_name>');
  }

  if (data.params.length > 1) {
    bot.sendChat('only one trigger at a time');
    return bot.sendChat('*usage:* !source <trigger_name>');
  }

  var trigger = data.params[0];

  if (trigger.charAt(0) === '!') {
    trigger = trigger.substring(1);
  }

  repo.getTrigger(bot, db, trigger, function(val){
    if (val !== null){
      var keys = Object.keys(val);
      var result = val[keys[0]];
      var theAuthor = result.Author || "unknown";
      var status = result.status || "created/updated";

      return bot.sendChat(`the trigger ${trigger} was ${status} by ${theAuthor}`);
    }
  });
}

module.exports = findTrigger;