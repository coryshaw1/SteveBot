var raffle = require(process.cwd()+'/bot/utilities/raffle');

module.exports = function(bot, db, data) {
	if(!bot.hasPermission(data.user, 'set-roles')) {
        return bot.moderateDeleteChat(data.id, function(response){
            bot.log("info", "BOT", 'Nice try @' + data.user.username + ' :sunglasses:');
        });
    }

    if(!raffle.raffleStarted)
        raffle.startRaffle(bot);
};
