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
    // more commands to come
    default:
    break;
  }

};

/******

Ideas:
- restore - restore firebase from latest backup


*******/
