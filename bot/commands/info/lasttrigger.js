'use strict';
const triggerStore = require(process.cwd()+ '/bot/store/triggerStore.js');

module.exports = function(bot, db, data) {
  
  if (!data) {
    bot.log('error', 'BOT', '[TRIG] ERROR: Missing data');
    return bot.sendChat('An error occured, try again');
  }

  var lastTrig = triggerStore.getLast();

  if (lastTrig) {
    let trigname = lastTrig.Trigger.replace(/:$/, '');
    bot.sendChat(`!${trigname} was the most recently ${lastTrig.status} trigger by ${lastTrig.Author}`);
  }

};