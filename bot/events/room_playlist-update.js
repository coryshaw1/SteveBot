'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var userStore = require(process.cwd()+ '/bot/store/users.js');
var youtube = require(process.cwd()+'/bot/utilities/youtube');
var historyStore = require(process.cwd()+ '/bot/store/history.js');
var _ = require('lodash');

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

function songWarning(bot, db, data){ 
  // set your minutes time limit here

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

function checkHistory(bot, data){
  if (!historyStore.ready) {
    return;
  }
  var dj = _.get(data, 'user.username', 'dj');
  var check = historyStore.getSong(bot, data.media.id);
  if (check.length > 0) {
    var time = historyStore.convertTime(check[0].lastplayed);
    bot.sendChat(`@${dj}, this song was played ${time}`);
  }
  historyStore.save(bot, data);
}

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistUpdate, function(data) {
    bot.updub();
    
    /************************************************************
     *  song info and trackinng
     */
    
    var currentSong = mediaStore.getCurrent();
    var propped = userStore.getProps();
    var flowed = userStore.getFlows();
    
    /************************************************************
     * review points
     */
    // send chat message if there were any props or flow points given
    reviewPoints(bot, currentSong);

    /************************************************************
     * save current song as last song data in the store
     */
    
    //Save previous song for !lastplayed
    currentSong.usersThatFlowed = flowed.length;
    currentSong.usersThatPropped = propped.length;
    mediaStore.setLast(currentSong);

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
    newSong.dj = _.get(data, 'user.username', '404usernamenotfound');

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

  });
};
