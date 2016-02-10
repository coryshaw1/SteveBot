module.exports = function(bot, db, data) {
    if(bot.hasPermission(data.user, 'queue-order')) {
        if (typeof(data.params) !== "undefined" && data.params.length > 0) {
            if (data.params.length === 1) {
                if (data.params[0].substr(0, 1) === "@") {
                    var recipient = bot.getUserByName(data.params[0].replace("@",""));
                    var queuePosition = bot.getQueuePosition(recipient.id);
                    if(queuePosition > 0) {
                        bot.moderatePauseDJ(recipient.id, 0, function(response){});
                    }
                    else{
                        bot.sendChat("@" + recipient.username + " is not in the queue");
                    }
                } else {
                    bot.sendChat("@" + data.user.username + " you need to @[username] to lock their queue");
                }
            } else {
                bot.sendChat("@" + data.user.username + " you can only one lock one user's queue at a time");
            }
        } else {
            bot.sendChat("@" + data.user.username + " you didn't select a user. You need to @[username] to lock their queue");
        }
    }
};
