'use strict';
module.exports = function(bot, db, data) {

  //Check if user even has skip permissions
  if(bot.hasPermission(bot.getUserByName(data.user.username), 'skip')) {
      bot.moderateSkip(function(){
        bot.moderatePauseDJ(data.user.id, function(){
          bot.sendChat("@" + data.user.username + " you have been skipped and your queue has been paused. If you aren't AFK please re-enter the queue");
        });
      });
  }
};
