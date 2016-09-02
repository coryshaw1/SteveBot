var request = require("request");

module.exports = function(bot, db) {
	request("http://numbersapi.com/random/trivia", function (error, response, body) {
        bot.sendChat(!error && response.statusCode == 200 
                        ? body 
                        : "Bad request to facts...");
    });
};
