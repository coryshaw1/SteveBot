'use strict';
var repo = require(process.cwd()+'/repo');
var userStore = require(process.cwd()+ '/bot/store/users.js');

var successMsg = function(recipient, type, pointEmoji){
  if (type === 'flow') {
    return `@${recipient.username} now has ${recipient[type]} flowpoint :${pointEmoji}:`;
  } 
  return `@${recipient.username} now has ${recipient[type]} props :${pointEmoji}:`;
};

var noSelfAwardingMsg = function(username){
  return `Propping yourself @${username} is like patting yourself on the back`;
};

var noRepeatPointMsg = function(username, pointEmoji){
  return `@${username}, you have already given a :${pointEmoji}: for this song`;
};


/**
 * Save point to db and send chat message
 * @param {Object} bot       Dubapi instance
 * @param {Object} db        Firebase instance
 * @param {Object} data      user info
 * @param {Object} recipient target user info
 */
function addPoint(bot, db, data, recipient, pointType, repeatCheck, pointEmoji) {
  repo.incrementUser(db, recipient, pointType, function(user){
    if (!user) {return;}
    userStore.addPoint( repeatCheck, data.user.id);
    bot.sendChat( successMsg(user, pointType, pointEmoji) );
  });
}


module.exports = function(bot, db, data, trig, type) {
  if (data.user.username === bot.myconfig.botName) {
    return bot.sendChat('I am not allowed to award points');
  }

  type = type.split('=');

  var pointType = 'props'; // this must match the name in the db
  var repeatCheck = 'usersThatPropped';
  var pointEmoji = type[1] || 'fist';
  
  if (type[0] === '+flow') {
    pointType = 'flow'; // this must match the name in the db
    repeatCheck = 'usersThatFlowed';
    pointEmoji = type[1] || 'surfer';
  }

  // send the trigger no matter what but remove the +prop/+flow stuff
  var re = new RegExp("\\+"+pointType+"?(=[a-z0-9_-]+)?$", "i");
  var strippedMsg = trig.replace(re,"");
  if (strippedMsg !== '') {
    bot.sendChat(strippedMsg);
  }

  if(!bot.getDJ()) {
    return bot.sendChat('There is no DJ playing!');
  }

  if (!bot.myconfig.allow_multi_prop ) {
    // no repeat giving
    if ( userStore.hasId( repeatCheck, data.user.id ) ) {
      return bot.sendChat( noRepeatPointMsg(data.user.username, pointEmoji) );
    }
  }

  var dj = bot.getDJ();
  
  // can not give points to self
  // but don't show a warning, just remain silent
  if(data.user.username === dj.username){
    // return bot.sendChat( noSelfAwardingMsg(data.user.username) );
    return;
  }

  return addPoint(bot, db, data, dj, pointType, repeatCheck, pointEmoji);

};