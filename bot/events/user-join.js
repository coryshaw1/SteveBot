'use strict';
const repo = require(process.cwd()+'/repo');
const settings = require(process.cwd() + '/private/settings.js');

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

    if (data.user.username === settings.OWNER) {
      bot.sendChat(`Hi @${settings.OWNER}, welcome back! All systems are go.`);
    }

    repo.logUser(db, data.user, function(user){
    
      var info = `[JOIN] ${user.username} | ${user.id} | ${user.dubs} | ${user.logType}`;
      bot.log('info', 'BOT', info);
    });

  });
};