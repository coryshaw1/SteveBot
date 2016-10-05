'use strict';
var settings = require(process.cwd() + '/private/settings.js');
var _ = require('lodash');

module.exports = function(bot, db, data) {
  if (typeof bot !== 'object' || typeof data !== 'object') {
    return;
  }

  var userName = _.get(data, 'user.username');
  if (!userName) { return; }

  // check if person sending chat is the owner
  if (userName !== settings.OWNER) {
    return bot.sendChat('Sorry I only take admin commands from my master');
  }

  // now we can assume all chats are from owner
  
  var command = _.get(data, 'params[0]');
  // if messages was just '!admin' without a any arguments
  if (!command) {
    bot.sendChat('What would you like me to do master?');
    return;
  }

  // now to go through possible commands
  // !admin command extra stuff  
  var extra = data.params.slice(1);
  switch(command) {
    case 'restart':
      bot.sendChat(':recycle: brb! :recycle:');
      setTimeout(process.exit, 1500);
      break;
    case 'reconnect':
      bot.sendChat(':recycle: brb! :recycle:');
      bot.disconnect();
      setTimeout(function(){
         bot.connect(settings.ROOMNAME);
      }, 5000);
      break;
    case 'mute':
      if (!bot.myconfig.muted) {
        bot.sendChat('ok I\'ll shut up now');
        bot.oldSendChat = bot.sendChat;
        bot.myconfig.muted = true;
        bot.sendChat = function(x){return;};
      }
      
      break;
    case 'unmute':
      if (bot.myconfig.muted) {
        bot.sendChat = bot.oldSendChat;
        bot.myconfig.muted = false;
        bot.sendChat('It\'s good to be back');
      }
      break;
    // more commands to come
    default:
    break;
  }

};

/******

Ideas:
- restore - restore firebase from latest backup


*******/
