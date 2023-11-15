'use strict';

/**
 * @param {DubAPI} bot
 */
module.exports = function(bot) {
  fetch('http://aws.random.cat/meow')
    .then(res => {
      if (res.status === 403) {
        // default to trying giphy
        bot.sendChat('!giphy cat');
        return;
      }
      return res.json()
    })
    .then(json => {
      if (json)  bot.sendChat(json.file)
    })
    .catch(err => {
      bot.log('error', 'BOT', `[!cat] ${err}`);
      bot.sendChat('Bad request to cats...');
    });
};