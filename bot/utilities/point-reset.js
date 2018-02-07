/** 
 * This module handles reseting points on the first of the month
 * and notifying every hour who is leading in props
 */
'use strict';
const schedule = require('node-schedule');
const repo = require(process.cwd()+'/repo');
const leaders = require(process.cwd() + '/bot/commands/credits/leaders.js');

var resetAllUserPoints = function(bot, db){
  if (!bot.myconfig.reset_points) { return; }

  var updatedUsers = {};
  Object.keys(bot.allUsers).forEach((key)=>{
    let user = bot.allUsers[key];
    updatedUsers[key] = user;
    updatedUsers[key].flow = 0;
    updatedUsers[key].props = 0;
  });

  repo.updateAllUsers(db, updatedUsers)
    .then(function(err){
      if (err) {
        console.log('updateAllUsers', err);
      } else {
        bot.sendChat('All user points have been reset to 0.');
        console.log('successfully updated all users and cleared their points');
      }
    })
    .catch(function(){
      console.log('error updating users', arguments);
    });
};

module.exports = function pointReset(bot, db){

  bot.log('info', 'BOT', 'Starting point reset scheduler: first of every month, at midnight');
  
  // this will run once a month, on the first of the month, at midnight
  var monthly = schedule.scheduleJob('0 0 1 * *', function(){
    // go through every user and reset their points
    resetAllUserPoints(bot, db);
  });

  // this will run at the top of every hour
  var hourly = schedule.scheduleJob('0 * * * *', function(){
    // notify the room who the current leaders are
    if (bot.myconfig.hourly_leader) { 
      leaders(bot);
    }
  });

};