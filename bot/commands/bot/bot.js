'use strict';
var checkPath = require(process.cwd()+'/bot/utilities/checkPath');

var getRandom = function (list) {
  return list[Math.floor((Math.random()*list.length))];
};

module.exports = function(bot, db, data) {
  var name = checkPath(data, 'data.user.username') || 'there';
  var responses = [
    'I\'m still here!',
    '!human',
    'beep boop',
    `Hi @${name}!`,
    'https://media.giphy.com/media/3o85xwc5c8DCoAF440/giphy.gif',
    'https://media.giphy.com/media/S0hxMGYFhEMzm/giphy.gif',
    'https://media.giphy.com/media/pIMlKqgdZgvo4/giphy.gif',
    'MUST KILL ALL HUM... sorry what was I talking about?',
    'So I says to Mabel I says...'
  ];

  bot.sendChat(getRandom(responses));
};