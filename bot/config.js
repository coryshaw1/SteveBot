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
  "botName" : "derpybot",

  // url location of this bot's commands
  "commands" : "http://franciscog.com/DerpyBot/commands/",

  "muted" : false,
  
  // turn on verbose logging
  'verboseLogging' : true, 
  
  // display a welcome message to new users
  'welcomeUsers' : false,
  
  // auto upvote every song
  'autoUpvote' : true, 
  
  // skip song if region blocked song is not allowed in this list
  'mainCountries' : ['US'], 
  
  // coming soon
  'cleverBot' : false,
  
  'autoskip' : {
    'enabled' : true, // needs to be true for the following autoskips to be honored
    'stuck' : true, // auto skip stuck/unplayable songs
  },

  'longSongs' : {
    // should we warn the room that a song exceeds the max length?
    'warn' : false,
    // set max song length so you can warn and/or auto skip
    'max' : minToMs(10),
    'skip' : false,
    'message' : 'Just a friendly warning that this song is 10 minutes or longer'
  }
};