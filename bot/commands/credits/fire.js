'use strict';
/*************************************************************************************************
 * Template for awarding a user a point of a specific type
 * All you need to do is alter the items below and the code will handle the rest
 */

var pointType = 'props'; // this must match the name in the db
var repeatCheck = 'usersThatPropped';

var successMsg = function(user, recipient){
  return `Yoooo keep up the good work @${recipient.username}! @${user.username} thinks your song is :fire: :fire: :fire:! You now have ${recipient.props} flames! :fire:`;
};

var noSelfAwardingMsg = function(username){
  return `Wow @${username} ... Love yourself in private weirdo... :confounded:`;
};

var noRepeatPointMsg = function(username){
  return `@${username}, you have already given a :fire: for this song`;
};

var badFormatMsg = function(username){
  return `@${username} you need to use @[username] to give a :fire: to someone`;
};

var noMultiAwarding = function(username){
  return `@${username} you can only give a :fire: to one person`;
};

/*************************************************************************************************/

var givePoint = require(process.cwd()+'/bot/utilities/givePoint');

var opts = {
  pointType : pointType,
  repeatCheck : repeatCheck,
  successMsg : successMsg,
  noSelfAwardingMsg : noSelfAwardingMsg,
  noRepeatPointMsg : noRepeatPointMsg,
  badFormatMsg : badFormatMsg,
  noMultiAwarding : noMultiAwarding
};


module.exports = function(bot, db, data) {
  givePoint(bot, db, data, opts);
};
