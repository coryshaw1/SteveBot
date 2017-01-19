'use strict';
var Cleverbot = require('cleverbot-node');

module.exports = function(bot, db, data) {
  if (!bot) {
    return;
  }

  if (data.params.length < 1) {
    bot.sendChat("yes?");
    return;
  }

  var cleverbot = new Cleverbot();
  Cleverbot.prepare(function(){
    cleverbot.write(data.params.join(" "), function (response) {
      if (response) {
        if (response.sessionid.indexOf('404') >= 0 ) {
          bot.log('error', 'BOT', '404 response from cleverbot');
        }
        bot.sendChat(response.message);
      } else {
        bot.log('error', 'BOT', 'No response from cleverbot');
      }
    });
  });
};