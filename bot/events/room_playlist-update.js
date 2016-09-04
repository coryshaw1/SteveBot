var mediaInfo = require(process.cwd()+"/bot/utilities/media");
var usersInfo = require(process.cwd()+"/bot/utilities/users");

module.exports = function(bot, db) {
    bot.on(bot.events.roomPlaylistUpdate, function(data) {
        bot.updub();

        if(usersInfo.usersThatPropped.length > 0 || usersInfo.usersThatHearted.length > 0) {
            var messageToSend = "'" + mediaInfo.currentName + "', queued by " + mediaInfo.currentDJName + " received ";

            if(usersInfo.usersThatPropped.length > 0) {
                messageToSend += usersInfo.usersThatPropped.length + " prop" + (usersInfo.usersThatPropped.length > 1 ? "s" : "") + " :fist:";

                if(usersInfo.usersThatHearted.length > 0)
                    messageToSend += " and ";
            }
                
            if(usersInfo.usersThatHearted.length > 0) {
                messageToSend += usersInfo.usersThatHearted.length + " heart" + (usersInfo.usersThatHearted.length > 1 ? "s" : "") + " :heart:";
            }

            bot.sendChat(messageToSend);
        }

        //Save previous song for !lastplayed
        mediaInfo.lastMedia.currentName = mediaInfo.currentName;
        mediaInfo.lastMedia.currentID = mediaInfo.fkid;
        mediaInfo.lastMedia.currentType = mediaInfo.type;
        mediaInfo.lastMedia.currentDJName = mediaInfo.currentDJName;
        mediaInfo.lastMedia.currentLink = mediaInfo.currentLink;
        mediaInfo.lastMedia.usersThatPropped = usersInfo.usersThatPropped;
        mediaInfo.lastMedia.usersThatHearted = usersInfo.usersThatHearted;

        //Reset user props/tunes/hearts stuff
        usersInfo.usersThatPropped = [];
        usersInfo.usersThatHearted = [];

        //Media info
        mediaInfo.getLink(bot, function(link){
            mediaInfo.currentLink = !link ? "" : link;
        });
        mediaInfo.lastMediaFKID = mediaInfo.currentID;

        if(!data.media) return;

        mediaInfo.currentName = data.media.name;
        mediaInfo.currentID = data.media.fkid;
        mediaInfo.currentType = data.media.type;
        mediaInfo.currentDJName = (data.user == undefined ? "404usernamenotfound" : (data.user.username == undefined ? "404usernamenotfound" : data.user.username));
    });
};
