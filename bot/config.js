'use strict';

// convert X minutes to ms
function minToMs(x) {
  return  x/*min*/ * 60/*sec*/ * 1000 /*ms*/;
}

/**
 * Some basic configs for the bot
 * @type {Object}
 */
module.exports = {
  // url location of this bot's commands
  "commands" : "http://franciscog.com/DerpyBot/commands/",

  "muted" : process.env.MUTED ? true : false,

  // allow a user to give multiple props for the same song
  "allow_multi_prop" : false,
  
  // turn on verbose logging
  'verboseLogging' : true, 
  
  // display a welcome message to new users
  'welcomeUsers' : false,
  
  // auto upvote every song
  'autoUpvote' : true, 

  // enable cleverbot API to respond whenever someone @ the bot 
  'cleverbot' : true,

  // play music when the queue is empty
  'playOnEmpty' : false,

  // id of the playlist to use when queue is empty
  'playlistID' : '58810d14c3d427420056f6c2',

  // name of the playlist (althernative to playlist id, can find id using getPlaylists)
  'playlistName' : 'main (1)',

  // make the bot save any song played (not skipped) to a playlist
  'saveSongs' : false, 
  
  // if a song is stuck because it has issues, automatically skip it
  'autoskip_stuck' : true,

  // should we warn the room that a song in the queue was played within X amount of hours
  'recently_played_warning' : true,
  // How many HOURS ago, or more, it's ok to allow a song to repeat
  'recently_played_limit' : 12,

  // how many pages of history to scrape initially on load
  'history_pages': 8,

  // reset all user prop/flow/etc points back to 0 at the beginning of each month
  'reset_points' : true,

  // whether the bot should announce to the room every hour who the currently monthly leaders are
  'hourly_leader' : true,

  'longSongs' : {
    // should we warn the room that a song exceeds the max length?
    'warn' : false,
    // set max song length so you can warn and/or auto skip
    'max' : minToMs(10),
    // auto skip a song that's long
    'skip' : false,
    // chat message to show when a song is skipped
    'message' : 'Just a friendly warning that this song is 10 minutes or longer'
  }
};