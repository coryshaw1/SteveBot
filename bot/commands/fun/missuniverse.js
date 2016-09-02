module.exports = function(bot, db) {
	bot.sendChat("And the winner of Miss Universe is...");
    setTimeout(function(){
        bot.sendChat("Miss Colombia!!!");
        setTimeout(function(){
            bot.sendChat("Haha just kidding, it's Miss Steve Harvey");
            bot.sendChat("It's on the card here, see");
        }, 3000);
    }, 2000);
};
