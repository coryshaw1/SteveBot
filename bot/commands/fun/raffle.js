var raffle = require(process.cwd()+'/bot/utilities/raffle');

module.exports = function(bot, db, data) {
	if(data.user.username !== 'mbsurfer'){
        return bot.moderateDeleteChat(data.id, function(response){
            bot.log("info", "BOT", 'Nice try @' + data.user.username + ' :sunglasses:');
        });
    }

    if(!raffle.raffleStarted)
        raffle.startRaffle(bot);
};
