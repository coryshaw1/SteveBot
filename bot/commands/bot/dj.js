'use strict';
const _ = require('lodash');
const roleChecker = require(process.cwd()+ '/bot/utilities/roleChecker.js');
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;


module.exports = function(bot, db, data) {
  return bot.sendChat("The !dj command is disabled for now until some issues are resolved");

  // if not at least a MOD, GTFO!
  if ( !roleChecker(bot, data.user, 'mod') ) {
    bot.sendChat('sorry, !dj can only be used by mods');
  }

  // !dj stop
  // to stop DJing and clear Queue
  if (data.params.length === 1 && data.params[0] === 'stop') {
    bot.pauseQueue(true, function(code, _data){
      if (code === 200) {
        bot.sendChat('Left the queue. That was fun but I just want to chill now');
        bot.log('info', 'BOT', 'Successfully paused my queue');
        bot.commandedToDJ = false;
        bot.isDJing = false;

        // clear the queue after pausing
        bot.clearQueue(function(code, _data){
          // this will return 500 even if successful 
          if (code === 500) {
            bot.log('info', 'BOT', 'Successfully cleared my queue');
          } else {
            bot.log('error','BOT', `Could not clear the queue - ${code} ${_data}`);
          }
        });

      } else {
         bot.log('error','BOT', "Could not pause queue");
         bot.sendChat(`Error leaving the queue, probably an API issue. Try again or manually remove me.`);
       }
    });
    return;
  }

  // first we queue the playlist
  bot.sendChat('Sure thing! Just give me moment, the API for this can be a bit slow');
  bot.queuePlaylist(
    bot.myconfig.playlistID, 
    function(code, _data){
      console.log("queuePlaylist", code, _data);
      if (code === 200) {
        bot.log('info', 'BOT', 'Successfully queued playlist');

        bot.getUserQueue(bot._.self.id, function(err, response){
          console.log(err, response);
        });

        // then in the success we join the queue by unpausing it
        bot.pauseQueue(false, function(code, _data){
          console.log("pauseQueue", code, _data);
          if (code === 200) {
            bot.sendChat("Ok I've joined the queue! Don't worry boss, I won't let you down");
            bot.log('info', 'BOT', 'Successfully joined the queue');
            bot.commandedToDJ = true;
            bot.isDJing = true;
            
          } else {
            bot.log('error','BOT', 'Could not unpause queue');
            bot.sendChat(`Error joining the queue, probably an API issue. Check the queue to see if I've joined. If I'm not in it then try again. If errors continue to happen then you can harass ${settings.OWNER}`);
          }
        });

      } else {
         let msg = _.get(_data, 'data.details.message', 'error');
         bot.log('error','BOT', `Could not queue playlist - ${code} ${msg}`);
         bot.sendChat("Error joining the queue, probably an API issue. Check the queue to see if I've joined. If I'm not in it then try again.");
      }
    }
  );

  
};