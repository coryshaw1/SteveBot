'use strict';

/**
 * @param {DubAPI} bot 
 */
module.exports = function(bot) {
  fetch('https://random.dog/woof.json')
    .then(res => {
      if (res.ok) return res.json()
      else throw new Error(res.status.toString());
    })
    .then(json => bot.sendChat(json.url))
    .catch(err => {
      bot.log('error', 'BOT', `[!dog] ${err.message}`);
      bot.sendChat('Bad request to dog...');
    });
};