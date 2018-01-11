'use strict';
var raffle = require(process.cwd()+"/bot/utilities/raffle");

module.exports = function(bot, db, data) {
	if(!raffle.raffleStarted) return bot.sendChat("There isn't a raffle at this time!");

    if(raffle.usersInRaffle.some(function(v) { return data.user.id.indexOf(v.id) >= 0; })) {
        return bot.sendChat("@" + data.user.username + " you've already entered the raffle!");
    }

    if(!bot.getQueue().some(function(v) { return data.user.id.indexOf(v.uid) >= 0; })) {
        return bot.sendChat("@" + data.user.username + " you must be in the queue to enter the raffle!");
    }

    var something = bot.moderateDeleteChat(data.id, function(response){
        if(bot.getQueuePosition(data.user.id) == 0) {
            raffle.lockedNumberOne = data.user.username;
            bot.sendChat("@" + data.user.username + " locked in their position at #1!");
        }
        else {
            raffle.usersInRaffle.push({"id": data.user.id, "username": data.user.username});
            bot.log("info", "BOT", "Added " + data.user.username + " to the raffle");
        }
    });
};
