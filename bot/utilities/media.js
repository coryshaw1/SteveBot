'use strict';
var settings = require(process.cwd() + '/private/settings.js');
var request = require('request');

module.exports.currentLink = '';
module.exports.currentName = '';
module.exports.currentID = '';
module.exports.currentType = '';
module.exports.currentDJName = '';
module.exports.lastMedia = {};

module.exports.getLink = function(bot, callback) {
	var media = bot.getMedia();

    if(!media) return callback();

    if(media.type === 'soundcloud') {
        var options = {
            url: 'https://api.soundcloud.com/tracks/' + media.fkid + '.json?client_id=' + settings.SOUNDCLOUDID
        };

        var responseBack = function(error, response, body) {
            if(!error){
                try{
                    var json = JSON.parse(body);
                    return callback(json.permalink_url);
                }
                catch(e){
                    bot.log('error', 'BOT', 'Soundcloud API error fetching song! Could be caused by invalid Soundcloud API key');
                    return callback('https://api.dubtrack.fm/song/' + media.id + '/redirect');
                }
            }
            else {
                bot.log('error', 'BOT', 'Soundcloud Error: ' + error);
                return callback('https://api.dubtrack.fm/song/' + media.id + '/redirect');
            }
        };

        request(options, responseBack);
    }
    else {
        return callback('http://www.youtube.com/watch?v=' + media.fkid);
    }
};