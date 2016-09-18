'use strict';
var repo = require(process.cwd()+'/repo');
var usersInfo = require(process.cwd()+'/bot/utilities/users');
var _ = require('underscore');

/**
 * Save flowpoint to db and send chat message
 * @param {Object} bot       Dubapi instance
 * @param {Object} db        Firebase instance
 * @param {Object} data      user info
 * @param {Object} recipient target user info
 */
function addFlow(bot, db, data, recipient) {
  repo.flowUser(db, recipient, function(user){
    usersInfo.usersThatFlowed.push(data.user.id);
    var msg = `@${data.user.username} has awarded @${recipient.username} 1 flowpoint. `;
    msg += `Let's keep that flow going! :ocean:`;
    bot.sendChat(msg);
  });
}

/**
 * Chat message to send if user tries to award themselves a flowpoint
 * @param  {Object} bot      Dubapi instance
 * @param  {string} username
 */
function noSelfFlow(bot, username){
  bot.sendChat(`@${username}, you can't give yourself a flowpoint :confounded:`);
}

/**
 * Chat message to send if someone tries to give 2 flowpoints to the same person for the same song
 * @param  {Object} bot      Dubapi instance
 * @param  {String} username 
 */
function alreadyFlowed(bot, username){
  bot.sendChat(`@${username}, you've already given a flowpoint for this song! :stuck_out_tongue_closed_eyes: `);
}

module.exports = function(bot, db, data) {
  if(!bot.getDJ()) {
      return bot.sendChat('There is no DJ playing!');
  }

  if(data.params.length > 0){
    
    if(_.contains(usersInfo.usersThatFlowed, data.user.id)) {
      return alreadyFlowed(bot, data.user.username);
    }

    if (data.params.length === 1) {

      if (data.params[0].substr(0, 1) === '@' && data.params[0] !== '@' + data.user.username) {
        var recipient = bot.getUserByName(data.params[0].replace('@', ''), true);
        return addFlow(bot, db, data, recipient);
      } 
      
      if (data.params[0].substr(0, 1) === '@' && data.params[0] === '@'+data.user.username){
        return noSelfFlow(bot, data.user.username);
      } else {
        bot.sendChat(`@${data.user.username} you need to use @[username] to give flowpoints to someone`);
      }

    } else {
      bot.sendChat(`@${data.user.username} you can only give flowpoints to one person`);
    }

    return;
  }

  if(data.user.username !== bot.getDJ().username){

    if(_.contains(usersInfo.usersThatFlowed, data.user.id)) {
      return alreadyFlowed(bot, data.user.username);
    }

    addFlow(bot, db, data, bot.getDJ());
  
  } else {
    noSelfFlow(bot, data.user.username);
  }
    
};