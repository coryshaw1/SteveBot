'use strict';

/***********************************************************************
* Adds Direct Messaging to DubApi
* I'm probably going to separate this so that each of functions below
* is their own module
**/

// location of the dubapi package
let loc = process.cwd() + '/node_modules/dubapi';
const endpoints = require(loc + '/lib/data/endpoints.js');
const events = require(loc + '/lib/data/events.js');

events.newMessage = 'new-message';

endpoints.message = 'message';
endpoints.messageConv = 'message/%CONVID%';
endpoints.messagePoll = 'message/new';
endpoints.messageRead = 'message/%CONVID%/read';

const DM = {
  getConvo : function(bot, convoID, callback) {
   // GET https://api.dubtrack.fm/message/%CONVID% - Get messages in a given conversation

  },
  reply : function(bot, convoID, callback) {
    //POST https://api.dubtrack.fm/message/%CONVID% - Send message in given conversation
  },
  startConvo : function(bot, userID, callback) {
    // POST https://api.dubtrack.fm/message - Create conversation
  },

  /**
   * Gets all the DMs for the bot
   * @param  {DubAPI}   bot      the dubapi instance
   * @param  {() => void} callback
   * @return {boolean}            
   */
  getAll : function(bot, callback) {
     if (!bot._.connected){ return false; }
     var url  = endpoints.message;
     bot._.reqHandler.queue({method: 'GET', url: url}, callback);
     return true;
  },

  /**
   * Checks to see if there's one or more new DMs
   * @param  {DubAPI}   bot      the dubapi instance
   * @param  {() => void} callback on success, data.data only returns a the number of new mesaages, it does not return the messages themselves
   * @return {Boolean}            
   */
  getAllNew : function(bot, callback) {
    if (!bot._.connected){ return false; }
    var url  = endpoints.messagePoll;
    bot._.reqHandler.queue({method: 'GET', url: url}, callback);
    return true;
  },

  /**
   * Mark a specific DM conversation as read
   * @param  {object}   bot      the dubapi instance
   * @param  {number}   convoID  the conversation ID
   * @param  {() => void} callback 
   * @return {boolean}            
   */
  markRead : function(bot, convoID, callback) {
    // POST https://api.dubtrack.fm/message/%CONVID%/read - Mark conversation as read
    if (!bot._.connected){ return false; }
    var url  = endpoints.messageRead.replace('%CONVID%',convoID);
    this._.reqHandler.queue({method: 'POST', url: url}, callback);
    return true;
  }

};

module.exports = DM;