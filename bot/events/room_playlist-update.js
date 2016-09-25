'use strict';
var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var usersInfo = require(process.cwd()+'/bot/utilities/users');
var youtube = require(process.cwd()+'/bot/utilities/youtube');
var soundcloud = require(process.cwd()+'/bot/utilities/soundcloud');
var checkPath = require(process.cwd()+'/bot/utilities/checkPath');

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
    
    // set time limit here
    var minToMs = 10/*min*/ * 60/*sec*/ * 1000 /*ms*/;

    var songLength = checkPath(data, 'data.media.songLength') || null;
    if (songLength >= minToMs) {
      bot.sendChat('Hey this song is pretty long, just sayin\'... you all cool with this?');
    }

    var songID = checkPath(data, 'data.media.fkid') || null;
    var type = checkPath(data, 'data.media.type') || null;
    if (!type || !songID) { return; }

    if (type.toUpperCase() === 'YOUTUBE'){
      return youtube(bot, songID);
    }

    if (type.toUpperCase() === 'SOUNDCLOUD'){
      // return soundcloud(bot, songID);
    }

  });
};
