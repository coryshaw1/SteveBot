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
  
  // set max song length so you can warn and/or auto skip
  'maxSongLength' : minToMs(10), 

  'autoskip' : {
    'enabled' : true, // needs to be true for the following autoskip to be honored
    'skipStuck' : true, // auto skip stuck/unplayable songs
    'skipLong' : false // skips songs that exceed the maxSongLength
  }
};