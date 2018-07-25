'use strict';

const triggerStore = require(process.cwd()+ '/bot/store/triggerStore.js');

module.exports = function(bot, db, data)  {
  if (!data) {
    return bot.sendChat('An error occured, try again');
  }

  if (data.params.length === 0) {
    return bot.sendChat('*usage:* !search <name, minimum 3 letters>');
  }

  if (data.params[0].length < 3) {
    return bot.sendChat('Your search term should be at least 3 letters or more');
  }

  var results = triggerStore.search(data.params[0]);
  
  if (results.length > 50) {
    bot.sendChat('Too many results, only showing first 50:');
    let str = results.slice(0,50).join(', ');
    bot.sendChat(str);
    return;
  }

  if (results && results.length > 0) {
    let str = results.join(', ');
    bot.sendChat(str);
  }
};