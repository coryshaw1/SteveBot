'use strict';
/*************************************************************************************************
 * Template for awarding a user a point of a specific type
 * All you need to do is alter the items below and the code will handle the rest
 */

var pointType = 'props'; // this must match the name in the db
var repeatCheck = 'usersThatPropped';

var successMsg = function(user, recipient){
  return `Keep up the good work @${recipient.username}, @${user.username} likes your songs! You now have ${recipient.props} :fist:`;
};

var noSelfAwardingMsg = function(username){
  return `Propping yourself @${username} is like patting yourself on the back`;
};

var noRepeatPointMsg = function(username){
  return `@${username}, you have already given a :fist: for this song`;
};

var badFormatMsg = function(username){
  return `@${username} you need to use @[username] to give a :fist: to someone`;
};

var noMultiAwarding = function(username){
  return `@${username} you can only give a :fist: to one person`;
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