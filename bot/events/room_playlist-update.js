'use strict';
var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var userStore = require(process.cwd()+ '/bot/store/users.js');
var youtube = require(process.cwd()+'/bot/utilities/youtube');
// var soundcloud = require(process.cwd()+'/bot/utilities/soundcloud');
var _ = require('lodash');

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistUpdate, function(data) {
    bot.updub();

    // console.log(data.media);

    var messageToSend = [];
    var plural = '';
    var finalChat = '';

    var propped = userStore.getProps();
    if (propped.length > 0) {
      plural = propped.length > 1 ? 's' : '';
      messageToSend.push(`${propped.length} prop${plural} props :fist: :heart: :musical_note:`);
    }

    var flowed = userStore.getFlows();
    if (flowed.length > 0) {
      plural = flowed.length > 1 ? 's' : '';
      messageToSend.push(`${flowed.length} flowpoint${plural} :surfer:`);
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
    mediaInfo.lastMedia.usersThatPropped = propped;
    mediaInfo.lastMedia.usersThatFlowed = flowed;

    //Reset user props/tunes stuff
    userStore.clear();

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
    
    // set your minutes time limit here
    var minToMs = 10/*min*/ * 60/*sec*/ * 1000 /*ms*/;

    var songLength = checkPath(data, 'data.media.songLength') || null;
    if (songLength >= minToMs) {
      bot.sendChat('Just a friendly warning that this song is 10 minutes or greater');
    }

    var songID = _.get(data, 'media.fkid');
    var type = _.get(data, 'media.type');

    if (!type || !songID) { return; }
    type = type.toUpperCase();
    
    if (type === 'YOUTUBE'){
      return youtube(bot, db, data.media);
    }

    if (type === 'SOUNDCLOUD'){
      // return soundcloud(bot, songID);
    }

  });
};
