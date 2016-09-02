var request = require("request");

module.exports = function(bot, db) {
	request("http://numbersapi.com/" + (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/date", function (error, response, body) {
        bot.sendChat(!error && response.statusCode == 200 
                        ? body 
                        : "Bad request to facts...");
    });
};