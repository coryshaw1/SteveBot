var settings = require(process.cwd() + '/settings.js').settings;
var request = require('request');

module.exports.currentLink = "";
module.exports.currentName = "";
module.exports.currentID = "";
module.exports.currentType = "";
module.exports.currentDJName = "";

module.exports.getLink = function(bot, callback) {
	var media = bot.getMedia();

    if(!media) return callback();

    if(media.type === 'soundcloud') {
        var options = {
            url: 'https://api.soundcloud.com/tracks/' + media.fkid + '.json?client_id=' + settings.SOUNDCLOUDID
        };

        var responseBack = function(error, response, body) {
            if(!error){
                var body = JSON.parse(body);
                return callback(body.permalink_url);
            }
            else {
                bot.log("info", "BOT", "Soundcloud Error: " + error);
                return callback('Error... http://google.com');
            }
        }

        request(options, responseBack);
    }
    else {
        return callback('http://www.youtube.com/watch?v=' + media.fkid);
    }
};