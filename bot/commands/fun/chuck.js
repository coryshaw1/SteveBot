var request = require("request");

module.exports = function(bot, db) {
    request("http://api.icndb.com/jokes/random", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if(!json.type || json.type !== "success") 
                return bot.sendChat("Bad request to Chuck Norris... Probably busy kicking ass");

            bot.sendChat(json.value.joke
                            .replace("&quot;", '"')
                            .replace("&apos;", "'"));
        }
        else {
            bot.sendChat("Bad request to Chuck Norris... Probably busy kicking ass");
        }
    });
};
