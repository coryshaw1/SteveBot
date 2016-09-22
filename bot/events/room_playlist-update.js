'use strict';
var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var usersInfo = require(process.cwd()+'/bot/utilities/users');
var youtube = require(process.cwd()+'/bot/utilities/youtube');

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistUpdate, function(data) {
    bot.updub();

    var messageToSend = [];
    var plural = '';
    var finalChat = '';

    if (usersInfo.usersThatPropped.length > 0) {
      plural = usersInfo.usersThatPropped.length > 1 ? 's' : '';
      messageToSend.push(`${usersInfo.usersThatPropped.length} prop${plural} :fist:`);
    }

    if (usersInfo.usersThatHearted.length > 0) {
      plural = usersInfo.usersThatHearted.length > 1 ? 's' : '';
      messageToSend.push(`${usersInfo.usersThatHearted.length} heart${plural} :heart:`);
    }

    if (usersInfo.usersThatFlowed.length > 0) {
      plural = usersInfo.usersThatFlowed.length > 1 ? 's' : '';
      messageToSend.push(`${usersInfo.usersThatFlowed.length} flowpoint${plural} :surfer:`);
    }

    if (messageToSend.length > 0) {
      finalChat = `'${mediaInfo.currentName}', queued by ${mediaInfo.currentDJName} received `;
      finalChat += messageToSend.join( ' and ' );
      bot.sendChat(finalChat);
    }

    //Save previous song for !lastplayed
    mediaInfo.lastMedia.currentName = mediaInfo.currentName;
    mediaInfo.lastMedia.currentID = mediaInfo.fkid;
    mediaInfo.lastMedia.currentType = mediaInfo.type;
    mediaInfo.lastMedia.currentDJName = mediaInfo.currentDJName;
    mediaInfo.lastMedia.currentLink = mediaInfo.currentLink;
    mediaInfo.lastMedia.usersThatPropped = usersInfo.usersThatPropped;
    mediaInfo.lastMedia.usersThatHearted = usersInfo.usersThatHearted;
    mediaInfo.lastMedia.usersThatFlowed = usersInfo.usersThatFlowed;

    //Reset user props/tunes/hearts stuff
    usersInfo.usersThatPropped = [];
    usersInfo.usersThatHearted = [];
    usersInfo.usersThatFlowed = [];

    //Media info
    mediaInfo.getLink(bot, function(link){
        mediaInfo.currentLink = !link ? '' : link;
    });
    mediaInfo.lastMediaFKID = mediaInfo.currentID;

    if(!data.media) { return; }

    mediaInfo.currentName = data.media.name;
    mediaInfo.currentID = data.media.fkid;
    mediaInfo.currentType = data.media.type;
    
    mediaInfo.currentDJName = '404usernamenotfound';
    if ( data.user !== void(0) && data.user.username !== void(0) ) {
      mediaInfo.currentDJName = data.user.username;
    }

    //****************************/
    
    if (data && data.media && data.media.songLength >= 6000000) { // 10min
      // bot.sendChat('[AUTOMOD] Skip in 30 seconds - reply *!noskip* to stop'); 
      // bot.sendChat('Hey @everyone, This tracks exceeds the room track length limit, I\'m going to skip this track in the next 30 seconds unless someone responds with *!noskip*');
    }

    if (data && data.media && !data.media.streamUrl){
      youtube(bot, data.media.fkid);
    }

  });
};
