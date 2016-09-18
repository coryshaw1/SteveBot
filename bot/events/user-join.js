'use strict';
var repo = require(process.cwd()+'/repo');

/**
 * When a new user joins the room, we log their info to the db and we begin storing
 * props and what not
 * @param  {Object} bot Dubapi instance
 * @param  {Object} db  Firebase db instance
 */
module.exports = function(bot, db) {
  bot.on(bot.events.userJoin, function(data) {
    
    if (data.user.username === 'mixerbot') {
      bot.sendChat('hey @everyone, Mixerbot\'s back!');
    }

    repo.logUser(db, data.user, function(user){
    
      var info = `[JOIN] [${user.username} | ${user.id} | ${user.dubs} | ${user.logType}]`;
      bot.log('info', 'BOT', info);
    });

  });
};