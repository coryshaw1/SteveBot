'use strict';
const triggerStore = require(process.cwd()+ '/bot/store/triggerStore.js');
const triggerPoint = require(process.cwd()+ '/bot/utilities/triggerPoint.js');
const triggerFormatter = require(process.cwd()+ '/bot/utilities/trigger-formatter.js');

module.exports = function(bot, db, data) {
  var randomTrigger = triggerStore.randomProp();

  if (randomTrigger && randomTrigger.Returns && randomTrigger.Trigger) {
    let theReturn = triggerFormatter(randomTrigger.Returns, bot, data); 
    bot.sendChat('Trigger name: ' + randomTrigger.Trigger.replace(/\:$/, ''));
    return triggerPoint(bot, db, data, theReturn, theReturn.split(' ').pop() );
  }

};