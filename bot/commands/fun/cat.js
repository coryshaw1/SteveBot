'use strict';
var request = require('request');

module.exports = function(bot) {
  request('http://aws.random.cat/meow', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(body);
      bot.sendChat(json.file);
    } else {
      bot.sendChat('Bad request to cats...');
    }
  });
};