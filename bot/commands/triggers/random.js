'use strict';
const triggerStore = require(process.cwd()+ '/bot/store/triggerStore.js');
const triggerPoint = require(process.cwd()+ '/bot/utilities/triggerPoint.js');

module.exports = function(bot, db, data) {
  if (!data) {
    return bot.sendChat('An error occured, try again');
  }

  /************************************************
   * This handles just calling !random by itself
   */
  if (data.params.length === 0) {
    var randomTrigger = triggerStore.random();

    if (randomTrigger) {
      bot.sendChat('Trigger name: ' + randomTrigger.Trigger.replace(/\:$/, ''));
      bot.sendChat(randomTrigger.Returns);
    }
    return;
  }

  /************************************************
   * This handles doing random with filter
   */

  if (data.params[0].length < 3) {
    return bot.sendChat('Your random filter should be at least 3 letters or more');
  }

  var results = triggerStore.search(data.params[0]);

  if (results && results.length > 0) {
    let ran = results.random();
    // check if it's an exsiting trigger
    triggerStore.get(bot, db, data, function(trig){
      if (trig !== null) {
        var last = trig.split(" ").pop();
        var pointCheck = new RegExp("\\+(props?|flow)(=[a-z0-9_-]+)?", "i");
        if (pointCheck.test(last)) {
          return triggerPoint(bot, db, data, trig, last);
        } else {
          return bot.sendChat(trig);
        }
      } else {
        return bot.sendChat(`beep boop, *!${data.trigger}* is not a recognized command or trigger, beep boop`);
      }
    });
  } else {
    return bot.sendChat(`No results for the filter: ${data.params[0]}`);
  }

};