var skipService = require(process.cwd() + '/bot/utilities/skips');

module.exports = function(bot, db, data) {

    //Check if user even has skip permissions
    if(bot.hasPermission(bot.getUserByName(data.user.username), 'skip')) {
        if (typeof(data.params) !== "undefined" && data.params.length > 0) {
            if (data.params.length === 1) {
                switch(data.params[0].toLowerCase()){
                    case 'broke':
                    case 'broken':
                        skipService.broken(bot, db, data);
                        break;
                    case 'nsfw':
                        skipService.nsfw(bot, db, data);
                        break;
                    case 'op': 
                        skipService.op(bot, db, data);
                        break;
                    case 'theme':
                    case 'offtheme':
                    case 'topic':
                    case 'offtopic':
                    case 'genre':
                        skipService.theme(bot, db, data);
                        break;
                    case 'troll':
                        skipService.troll(bot, db, data);
                        break;
                    default:
                        bot.moderateSkip(function(){});
                        break;
                }
            }
            else{
                bot.moderateSkip(function(){});
            }
        }
        else {
            bot.moderateSkip(function(){});
        }
    }
};
