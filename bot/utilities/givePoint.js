'use strict';
var repo = require(process.cwd()+'/repo');
var userStore = require(process.cwd()+ '/bot/store/users.js');

/**
 * Save point to db and send chat message
 * @param {Object} bot       Dubapi instance
 * @param {Object} db        Firebase instance
 * @param {Object} data      user info
 * @param {Object} recipient target user info
 */
function addPoint(bot, db, data, recipient, opts) {
  repo.incrementUser(db, recipient, opts.pointType, function(user){
    if (!user) {return;}
    userStore.addPoint( opts.repeatCheck, data.user.id);
    bot.sendChat( opts.successMsg(data.user, user) );
  });
}


module.exports = function(bot, db, data, opts) {
  if(!bot.getDJ()) {
      return bot.sendChat('There is no DJ playing!');
  }

  // if user just wrote "![pointType]"
  if (data.params === void(0) || data.params.length === 0){

    // no repeat giving
    if(userStore.hasId( opts.repeatCheck, data.user.id) ) {
      return bot.sendChat( opts.noRepeatPointMsg(data.user.username) );
    }

    var dj = bot.getDJ();
    // can not give points to self
    if(data.user.username === dj.username){
      return bot.sendChat( opts.noSelfAwardingMsg(data.user.username) );
    }

    return addPoint(bot, db, data, dj, opts);
  }

  // if user wrote ![pointType] @person1 @person2 ...
  if (data.params.length > 1) {
    return bot.sendChat( opts.noMultiAwarding(data.user.username) );
  }

  // if user wrote ![pointType] recipient (but didn't use the '@'')
  if (data.params.length === 1 && data.params[0].charAt(0) !== '@') {
    return bot.sendChat( opts.badFormatMsg(data.user.username) );
  }

  // if user wrote ![pointType] @recipient
  if (data.params.length === 1 && data.params[0].charAt(0) === '@') {

    // can't give points to yourself
    if (data.params[0] === '@'+data.user.username) {
      return bot.sendChat( opts.noSelfAwardingMsg(data.user.username) );
    }

    // can't give points twice for the same song
    if(userStore.hasId( opts.repeatCheck, data.user.id) ) {
      return bot.sendChat( opts.noRepeatPointMsg(data.user.username) );
    }

    var recipient = bot.getUserByName(data.params[0].replace('@', ''), true);
    return addPoint(bot, db, data, recipient, opts);
  }
};