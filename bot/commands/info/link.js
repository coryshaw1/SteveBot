var mediaInfo = require(process.cwd()+'/bot/utilities/media');

module.exports = function(bot, db, data) {
	if(!data) return;

    if(!mediaInfo.currentLink)
    {
        bot.sendChat("No song is playing at this time!");
    }
    else{
        bot.sendChat("@" + data.user.username + " The current song is '" + mediaInfo.currentName + "', and the link is " + mediaInfo.currentLink);
    }
};
