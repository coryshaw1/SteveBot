'use strict';
var request = require('request');

module.exports = function(bot) {
  request('http://aws.random.cat/meow', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(body);
      bot.sendChat(json.file);
      return;
    } 
    
    if (!error && response.statusCode === 403) {
      bot.sendChat('!giphy cat');
      return;
    }

    bot.log('error', 'BOT', `[!cat] ${response.statusCode} ${error}`);
    bot.sendChat('Bad request to cats...');
    
  });
};