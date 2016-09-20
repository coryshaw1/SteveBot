'use strict';

module.exports = function(bot, db, data) {

  if (typeof(data.params) === 'undefined' || data.params.length === 0) {
    return bot.sendChat(`Say hi to who @${data.user.username}?`);
  }

  if (data.params.length > 1) {
    return bot.sendChat(`@${data.user.username} you can only say hi to one person`);
  }

  if (data.params.length === 1 && data.params[0].substr(0, 1) !== '@') {
    return bot.sendChat(`@${data.user.username}, use '!sayhi @[username]' to make the bot say hi to someone`);
  }

  if (data.params.length === 1 && data.params[0].substr(0, 1) === '@') {
    return bot.sendChat(`hi ${data.params[0]}, I'm DerpyBot!`);
  }

};