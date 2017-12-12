'use strict';

var request = require('request');

module.exports = function(bot) {
  request('https://random.dog/woof.json', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(body);
      bot.sendChat(json.url);
    } else {
      bot.sendChat('Bad request to dog...');
    }
  });
};