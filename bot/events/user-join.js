var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var repo = require(process.cwd()+'/repo');

module.exports = function(bot, db) {
    bot.on(bot.events.userJoin, function(data) {
        repo.logUser(db, data.user, function(user){
	    	bot.log("info", "BOT", '[JOIN]' + '[' + user.username + '|' + user.id + '|' +user.dubs + '|' + user.logType + ']');
	    });
    });
};