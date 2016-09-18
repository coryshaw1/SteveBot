'use strict';

var request = require('request');

module.exports = function(bot, db) {
	request('http://numbersapi.com/random/trivia', function (error, response, body) {
        var result = 'Bad request to facts...';
        if (!error && response.statusCode === 200){
          result = body;
        }
        bot.sendChat(result);
    });
};
