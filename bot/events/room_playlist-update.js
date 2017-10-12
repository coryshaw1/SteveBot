/***************************************************************
 * This event is fired when a new song begins to play
 */
'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var userStore = require(process.cwd()+ '/bot/store/users.js');
var youtube = require(process.cwd()+'/bot/utilities/youtube');
var historyStore = require(process.cwd()+ '/bot/store/history.js');
var _ = require('lodash');
var moment = require('moment');
var repo = require(process.cwd()+'/repo');

// var soundcloud = require(process.cwd()+'/bot/utilities/soundcloud');

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
 * Send a warning to chat when a song exceeds 
 * a certaim time length limit set in config
 * also checks YouTube for song issues and stores it
 * 
 * @param {Object} bot instanceOf dubapi
 * @param {Object} db database object
 * @param {Object} data dubapi song data
 * @returns 
 */
function songWarning(bot, db, data){ 
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

  type = type.toUpperCase();
  if (type === 'YOUTUBE'){
    return youtube(bot, db, data.media);
  }
  if (type === 'SOUNDCLOUD'){
    // return soundcloud(bot, songID);
  }
}

/**
 * Checks current playing song against room history and
 * gives a warning if song was played within a specific
 * time frame
 * 
 * @param {Object} bot 
 * @param {Object} data 
 * @returns 
 */
function checkHistory(bot, data){
  if (!historyStore.ready) {
    return;
  }
  
  var dj = _.get(data, 'user.username', 'dj');
  var songName = _.get(data, 'media.name', '404songnamenotfound');
  var songID = _.get(data, 'media.id');

  if (!songID) { return; }

  // compare current song with stored history
  // returns an array of matches
  var check = historyStore.getSong(bot, songID);

  if (check.length > 0) {
    var time = historyStore.convertTime(check[0].lastplayed);
    if (time.toLowerCase().indexOf('seconds') >= 0) {
      bot.log('info', 'BOT', `Not Warned: ${dj} - ${songName} - ${time}`);
      return;
    }
    bot.sendChat(`@${dj}, this song was played ${time}`);
    bot.log('info', 'BOT', `Warned: ${dj} - ${songName} - ${time}`);
  }
  historyStore.save(bot, data);
}

function lastPlayModel(currentSong, storedData) {
  var obj = {
    id : currentSong.id,
    type : currentSong.type,
    name : currentSong.name,
    firstplay : { 
      user : _.get(storedData , 'firstplay.user', currentSong.dj),
      when : _.get(storedData , 'firstplay.when', Date.now())
    }
  };

  var total = 1;
  var lastWhen = Date.now();

  if (storedData) {
    lastWhen = storedData.lastplay.when;
    total = storedData.plays;

    // don't want to incrememt time and plays if the bot reboot for some reason
    var songTime = storedData.lastplay.when + currentSong.length;
    if ( Date.now() - songTime > 0  ) {
      total = storedData.plays + 1;
      lastWhen = Date.now();
    }

  }

  obj.plays = total;
  obj.lastplay =  {
    user : currentSong.dj,
    when : lastWhen
  };
  return obj;
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
     */
    
    //Save previous song for !lastplayed
    currentSong.usersThatFlowed = flowed.length;
    currentSong.usersThatPropped = propped.length;
    mediaStore.setLast(db, currentSong);

    //Reset user props/tunes stuff
    userStore.clear();

    // start new song store
    var newSong = {};

    // get current song link
    mediaStore.getLink(bot, function(link){
        var val = !link ? '' : link;
        mediaStore.setCurrentKey('link', val);
    });

    // if no data.media from the api then stop now
    if(!data.media) { return; }

    newSong.name = data.media.name;
    newSong.id = data.media.fkid;
    newSong.type = data.media.type;
    newSong.length = data.media.songLength;
    newSong.dj = _.get(data, 'user.username', '404usernamenotfound');
    newSong.when = Date.now();

    // store new song data reseting current in the store
    mediaStore.setCurrent(newSong);

    /************************************************************
     * song issues
     */
    
    songWarning(bot, db, data);

    /************************************************************
     * Check if song has been played recently
     */
    
    checkHistory(bot, data);

    /************************************************************
     * Save song to playlist and for last/first-play func
     */
    if (bot.myconfig.saveSongs) {
      saveSong(db, bot, newSong);
    }

  });
};
