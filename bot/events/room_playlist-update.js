'use strict';
var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var usersInfo = require(process.cwd()+'/bot/utilities/users');

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
      finalChat = `'${mediaInfo.currentName}', queud by ${mediaInfo.currentDJName} received `;
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

  });
};
