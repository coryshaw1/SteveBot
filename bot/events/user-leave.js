module.exports = function(bot, db) {
    bot.on(bot.events.userLeave, function(data) {
    	bot.log("info", "BOT", '[LEAVE]' + '[' + data.user.username + '|' + data.user.id + '|' + data.user.dubs + ']');
    });
};