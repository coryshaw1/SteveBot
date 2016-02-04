var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var usersInfo = require(process.cwd()+'/bot/utilities/users');

module.exports = function(bot, db) {
    bot.on(bot.events.roomPlaylistUpdate, function(data) {
        bot.updub();

        //User props/tunes/hearts stuff
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