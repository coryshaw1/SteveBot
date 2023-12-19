'use strict';
const repo = require(process.cwd()+'/repo');
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;

/**
 * When a new user joins the room, we log their info to the db and we begin storing
 * props and what not
 * @param  {DubAPI} bot Dubapi instance
 * @param  {import('firebase-admin').database} db  Firebase db instance
 */
module.exports = function(bot, db) {
  bot.on(bot.events.userJoin, function(data) {

    repo.logUser(db, data.user, function(user){
      var info = `[JOIN] ${user.username} | ${user.id} | ${user.dubs} | ${user.logType}`;
      bot.log('info', 'BOT', info);
    });

  });
};