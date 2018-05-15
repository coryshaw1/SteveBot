/***************************************************************
 * Event: room_playlist-update
 * 
 * This event is fired when a new song begins to play
 */
'use strict';
const mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
const userStore = require(process.cwd()+ '/bot/store/users.js');
const youtube = require(process.cwd()+'/bot/utilities/youtube.js');
const soundcloud = require(process.cwd()+'/bot/utilities/soundcloud');
const historyStore = require(process.cwd()+ '/bot/store/history.js');
const _ = require('lodash');
const moment = require('moment');
const repo = require(process.cwd()+'/repo');

/**
 * 
 * @param {object} bot instance of dubapi
 * @param {object} currentSong song data of current track playing
 */
function reviewPoints(bot, currentSong) {
  var propped = userStore.getProps();
  var flowed = userStore.getFlows();

  var messageToSend = [];
  var plural = '';
  var finalChat = '';

 
  if (propped.length > 0) {
    plural = propped.length > 1 ? 's' : '';
    messageToSend.push(`${propped.length} prop${plural} :fist: :heart: :musical_note:`);
  }

  if (flowed.length > 0) {
    plural = flowed.length > 1 ? 's' : '';
    messageToSend.push(`${flowed.length} flowpoint${plural} :surfer:`);
  }

  if (messageToSend.length > 0) {
    finalChat = `'${currentSong.name}', queued by ${currentSong.dj} received `;
    finalChat += messageToSend.join( ' and ' );
    bot.sendChat(finalChat);
  }
}

/**
 * handles various song warning and skipping of broken tracks
 * for now this only handles youtube because it's more complex
 * 
 * @param {Object} bot instanceOf dubapi
 * @param {Object} db database object
 * @param {Object} data dubapi song data
 */
function songModerate(bot, db, data){ 
  var songLength = _.get(data, 'media.songLength');
  if (songLength &&
      bot.myconfig.longSongs.warn && 
      songLength >= bot.myconfig.longSongs.max) 
  {
    bot.sendChat(bot.myconfig.longSongs.message);
  }

  var songID = _.get(data, 'media.fkid');
  var type = _.get(data, 'media.type');
  if (!type || !songID) { return; }

  if (type.toUpperCase() === 'YOUTUBE'){
    return youtube(bot, db, data.media);
  }
}

/**
 * Save song to bot's own playlist.
 * Helpful to build a large playlist so bot can play during off hours
 * 
 * @param {Object} db 
 * @param {Object} bot 
 * @param {Object} song 
 */
function saveSong(db, bot, song) {
  // then save songs to bot's playlist for later use
  // skip saving songs on Funky Friday
  if (moment().format('dddd') === 'Friday') { return; }

  bot.getRoomHistory(1, function(history){
    
    if (history && history.length > 0) {

      // we don't want to save a skipped song
      if (history[0].skipped) {return;}

      let song = history[0]._song;

      bot.addToPlaylist(
        bot.myconfig.playlistID, song.fkid, song.type, 
        function(code, _data){
          if (code === 200) {
            bot.log('info','BOT', `${song.name} saved to playlist`);
          }
          if (code === 400) {
            bot.log('info','BOT', `${song.name} - ${_data.data.details.message}`);
          }
        }
      );
    }

  });
}

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistUpdate, function(data) {
    bot.updub();

    let dj = _.get(data, 'user.username', '404usernamenotfound');
    
    /************************************************************
     *  song info and trackinng
     */
    
    var currentSong = mediaStore.getCurrent(); // gets last played song
    var propped = userStore.getProps(); // get props given for last song
    var flowed = userStore.getFlows(); // get flow points for last song
    
    /************************************************************
     * review points
     * send chat message if there were any props or flow points given
     */
    reviewPoints(bot, currentSong);

    /************************************************************
     * save current song as last song data in the store
     * !lastplayed uses it
     */
    
    currentSong.usersThatFlowed = flowed.length;
    currentSong.usersThatPropped = propped.length;
    mediaStore.setLast(db, currentSong);

    //Reset user props/tunes stuff
    userStore.clear();

    // start new song store
    var newSong = {};

    // if no data.media from the api then stop now because everything below needs it
    if(!data.media) { return; }

    newSong.name = data.media.name;
    newSong.id = data.media.fkid;
    newSong.type = data.media.type;
    newSong.length = data.media.songLength;
    newSong.dj = dj;
    newSong.when = Date.now();

    // store new song data reseting current in the store
    mediaStore.setCurrent(newSong);

    if (data.media.type.toUpperCase() === 'SOUNDCLOUD') {

      soundcloud.getLink(bot, data.media ,function(result){
        mediaStore.setCurrentKey('link', result.link);
        // by doing this we also check if we need to skip because track is broken
        // youtube has much more various reasons for being skipped, sc is more basic
        // so we can do it here 
        if (result.skippable) {
          soundcloud.skip(bot, data.media, `Sorry @${dj} that ${result.reason}`, result.error_message);
        }

      });

    } else {
      mediaStore.setCurrentKey('link', `http://www.youtube.com/watch?v=${data.media.fkid}`);
    }

    /************************************************************
     * check youtube links for various issues
     */
    
    songModerate(bot, db, data);

    /************************************************************
     * Save song to playlist and for last/first-play func
     */
    if (bot.myconfig.saveSongs) {
      saveSong(db, bot, newSong);
    }

  });
};
