'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var userStore = require(process.cwd()+ '/bot/store/users.js');
var youtube = require(process.cwd()+'/bot/utilities/youtube');
// var soundcloud = require(process.cwd()+'/bot/utilities/soundcloud');
var checkPath = require(process.cwd()+'/bot/utilities/checkPath');
var _ = require('lodash');

function reviewPoints(bot, currentSong) {
  var propped = userStore.getProps();
  var flowed = userStore.getFlows();

  var messageToSend = [];
  var plural = '';
  var finalChat = '';

 
  if (propped.length > 0) {
    plural = propped.length > 1 ? 's' : '';
    messageToSend.push(`${propped.length} prop${plural} props :fist: :heart: :musical_note:`);
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
  if (songLength && songLength >= bot.myconfig.maxSongLength) {
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
}

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistUpdate, function(data) {
    bot.updub();
    
    // console.log(data.media);
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
        newSong.link = !link ? '' : link;
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

  });
};
