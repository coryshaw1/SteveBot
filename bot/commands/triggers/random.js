'use strict';
const triggerStore = require(process.cwd()+ '/bot/store/triggerStore.js');

module.exports = function(bot, db, data) {
  var randomTrigger = triggerStore.random();

  if (randomTrigger && randomTrigger.Returns && randomTrigger.Trigger) {
    let theReturn = randomTrigger.Returns;
    
    if (theReturn.indexOf('%dj%') >= 0){
      // replace with current DJ name
      theReturn = theReturn.replace('%dj%', '@' + bot.getDJ().username);
    }
    if (theReturn.indexOf('%me%') >= 0) {
      // replace with user who entered chat name
      theReturn = theReturn.replace('%me%', data.user.username);
    }

    bot.sendChat('Trigger name: ' + randomTrigger.Trigger.replace(/\:$/, ''));


    bot.sendChat(theReturn.replace(/\+(prop|flow)/gi,''));
  }

};