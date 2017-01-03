'use strict';
const _ = require('lodash');
const settings = require(process.cwd() + '/private/settings.js');

module.exports = {

  // You need to set bot.isDJing yourself in the callback
  join : function(bot, callback) {
    if (typeof callback !== 'function') {callback = function(){};}

    
    // queue up the playlist
    bot.queuePlaylist(
      bot.myconfig.playlistID, 
      function(code, _data){
        if (code === 200) {
          bot.log('info', 'BOT', 'Successfully queued playlist');

          // then in the success we join the queue by unpausing it
          bot.pauseQueue(false, callback);

        } else {
           let msg = _.get(_data, 'data.details.message', 'error');
           bot.log('error','BOT', `Could not queue playlist - ${code} ${msg}`);
           callback(code, _data, "queue playlist");
        }
      }
    );
  },


  // unlike join, bot.isDJing will automatically be set to false for you here
  leave : function(bot, callback) {
    if (typeof callback !== 'function') {callback = function(){};}

    bot.pauseQueue(true, function(code, _data){
      if (code === 200) {
        bot.log('info', 'BOT', 'Successfully paused my queue');
        bot.isDJing = false;
        
        // clear the queue after pausing
        bot.clearQueue(function(code, _data){
          // this will return 500 even if successful 
          if (code === 500) {
            callback(200, "queue cleared");
          } else {
            callback(500, _data, "clear queue");
          }
        });

      } else {
         bot.log('error','BOT', "Could not pause queue");
         callback(code, _data, "pause queue");
       }
    });
  }
};
