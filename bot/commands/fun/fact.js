'use strict';

/**
 * @param {DubAPI} bot
 */
module.exports = function(bot) {
  fetch('http://numbersapi.com/random/trivia')
    .then(res => {
      if (res.ok) return res.text()
      else throw new Error(res.status.toString());
    })
    .then(text => bot.sendChat(text))
    .catch(err => {
      bot.log('error', 'BOT', `[!fact] ${err.message}`);
      bot.sendChat('Bad request to facts...');
    }
};
