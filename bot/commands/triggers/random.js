'use strict';
const triggerStore = require(process.cwd()+ '/bot/store/triggerStore.js');

module.exports = function(bot) {
  var randomTrigger = triggerStore.random();

  if (randomTrigger && randomTrigger.Returns && randomTrigger.Trigger) {
    bot.sendChat('Trigger name: ' + randomTrigger.Trigger.replace(/\:$/, ''));
    bot.sendChat(randomTrigger.Returns.replace(/\+(prop|flow)/gi,''));
  }

};