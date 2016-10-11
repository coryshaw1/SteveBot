'use strict';
var skipService = require(process.cwd() + '/bot/utilities/skips');

module.exports = function(bot, db, data) {
  if(!bot.hasPermission(bot.getUserByName(data.user.username), 'skip')) {
    return bot.sendChat('Sorry I don\'t have skip permissions');
  }
  
  // just plain old skip
  if (typeof(data.params) === "undefined" || data.params.length === 0) {
    bot.moderateSkip(function(){});
    return;
  }

  // if too many arguments, then just plain skipping
  if (data.params.length > 1) {
    bot.moderateSkip(function(){});
    return;
  }

  switch(data.params[0].toLowerCase()){
    case 'broke':
    case 'broken':
        skipService.broken(bot, db, data);
        break;
    case 'nsfw':
        skipService.nsfw(bot, db, data);
        break;
    case 'op': 
        skipService.op(bot, db, data);
        break;
    case 'theme':
    case 'offtheme':
    case 'topic':
    case 'offtopic':
    case 'genre':
        skipService.theme(bot, db, data);
        break;
    case 'troll':
        skipService.troll(bot, db, data);
        break;
    default:
        bot.moderateSkip(function(){});
        break;
  }

};
