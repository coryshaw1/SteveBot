'use strict';
const Cleverbot = require('cleverbot-node');
const settings = require(process.cwd() + '/private/settings.js');

module.exports = function(bot, db, data) {
  if (!bot) {
    return;
  }

  if (data.params.length < 1) {
    bot.sendChat("how can I be of assistance?");
    return;
  }

  var cleverbot = new Cleverbot();
  cleverbot.configure({botapi: settings.CLEVERBOT_API_KEY});
  cleverbot.write(data.params.join(" "), function (response) {
    if (!response) {
      return bot.log('error', 'BOT', 'No response from cleverbot');
    }
    bot.sendChat(response.output);
  });
};