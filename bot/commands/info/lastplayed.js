var mediaInfo = require(process.cwd()+'/bot/utilities/media');

module.exports = function(bot, db, data) {
	if(!data) return;

    if(!mediaInfo.lastMedia || !mediaInfo.lastMedia.currentName)
    {
        bot.sendChat("I haven't been here for an ending of a song!");
    }
    else{
        bot.sendChat("@" + data.user.username + " The last song played was '" + mediaInfo.lastMedia.currentName + "', and the link is " + mediaInfo.lastMedia.currentLink);
    }
};

module.exports.extraCommands = ["lastsong", "lasttrack"];