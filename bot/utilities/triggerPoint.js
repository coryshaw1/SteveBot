'use strict';
var repo = require(process.cwd()+'/repo');
var userStore = require(process.cwd()+ '/bot/store/users.js');

var successMsg = function(recipient, type){
  if (type === 'flow') {
    return `@${recipient.username} now has ${recipient[type]} flowpoint :surfer:`;
  } 
  return `@${recipient.username} now has ${recipient[type]} props :fist:`;
};

var noSelfAwardingMsg = function(username){
  return `Propping yourself @${username} is like patting yourself on the back`;
};

var noRepeatPointMsg = function(username){
  return `@${username}, you have already given a :fist: for this song`;
};


/**
 * Save point to db and send chat message
 * @param {Object} bot       Dubapi instance
 * @param {Object} db        Firebase instance
 * @param {Object} data      user info
 * @param {Object} recipient target user info
 */
function addPoint(bot, db, data, recipient, trig, pointType, repeatCheck) {
  repo.incrementUser(db, recipient, pointType, function(user){
    if (!user) {return;}
    userStore.addPoint( repeatCheck, data.user.id);
    var re = new RegExp("\\+"+pointType.replace(/s$/i,"")+"s?", "i");
    bot.sendChat(trig.replace(re,""));
    bot.sendChat( successMsg(user, pointType) );
  });
}


module.exports = function(bot, db, data, trig, type) {
  var pointType = 'props'; // this must match the name in the db
  var repeatCheck = 'usersThatPropped';
  
  if (type === 'flow') {
    pointType = 'flow'; // this must match the name in the db
    repeatCheck = 'usersThatFlowed';
  }

  if(!bot.getDJ()) {
    return bot.sendChat('There is no DJ playing!');
  }

  // no repeat giving
  if(userStore.hasId( repeatCheck, data.user.id) ) {
    return bot.sendChat( noRepeatPointMsg(data.user.username) );
  }

  var dj = bot.getDJ();
  
  // can not give points to self
  if(data.user.username === dj.username){
    return bot.sendChat( noSelfAwardingMsg(data.user.username) );
  }

  return addPoint(bot, db, data, dj, trig, pointType, repeatCheck);

};