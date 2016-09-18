'use strict';
var request = require('request');

// 'http://numbersapi.com/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/date'
// 
module.exports = function(bot, db) {
  var month = new Date().getMonth() + 1;
  var day = new Date().getDate();
  var factApi = `http://numbersapi.com/${month}/${day}`;
  request(factApi, function (error, response, body) {
    var result = 'Bad request to facts...';
    if (!error && response.statusCode === 200 ) {
      result = body;
    }
    bot.sendChat(result);
  });
};