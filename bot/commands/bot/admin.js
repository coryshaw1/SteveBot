'use strict';
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;
var historyStore = require(process.cwd()+ '/bot/store/history.js');
const nmm = require(process.cwd()+ '/bot/store/nmm.js');
const ff = require(process.cwd()+ '/bot/store/ff.js');
var _ = require('lodash');

settings.APPROVED_USERS.push(settings.OWNER);
var approved = settings.APPROVED_USERS.map(function(u){return u.toLowerCase(); });
function checkCreds(user){
  return approved.indexOf(user.toLowerCase()) >= 0;
}

module.exports = function(bot, db, data) {
  if (typeof bot !== 'object' || typeof data !== 'object') {
    return;
  }

  var userName = _.get(data, 'user.username');
  if (!userName) { return; }

  // check if person sending chat is the owner
  if (!checkCreds(userName)) {
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
      bot.sendChat(':phone: Redialing Dubtrack, brb! :computer:');
      bot.disconnect();
      setTimeout(function(){
         bot.connect(settings.ROOMNAME);
      }, 5000);
      break;
    case 'mute':
      if (!bot.myconfig.muted) {
        bot.sendChat('I shut up now :speak_no_evil:');
        bot.oldSendChat = bot.sendChat;
        bot.myconfig.muted = true;
        bot.sendChat = function(x){return;};
      }
      break;
    case 'history':
      bot.sendChat('ok, updating my room playlist history');
      historyStore.init(bot);
      break;
    case 'refresh':
      bot.sendChat('refreshing all spreadsheet data');
      nmm.load(bot);
      ff.load(bot);
      break;
    case 'unmute':
      if (bot.myconfig.muted) {
        bot.sendChat = bot.oldSendChat;
        bot.myconfig.muted = false;
        bot.sendChat('It\'s good to be back :loudspeaker:');
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
