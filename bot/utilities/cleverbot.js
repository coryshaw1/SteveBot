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
        bot.sendChat(response.message);
      }
    });
  });
};