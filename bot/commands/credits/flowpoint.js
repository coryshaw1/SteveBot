'use strict';

/*************************************************************************************************
 * Template for awarding a user a point of a specific type
 * All you need to do is alter the items below and the code will handle the rest
 */

var pointType = 'flow'; // this must match the name in the db
var repeatCheck = 'usersThatFlowed';

var successMsg = function(user, recipient){
  return `@${user.username} has awarded @${recipient.username} 1 flowpoint :ocean:!`;
};

var noSelfAwardingMsg = function(username){
  return `@${username}, you can't give yourself a flowpoint no matter how good of a DJ you think you are :confounded:`;
};

var noRepeatPointMsg = function(username){
  return `@${username}, you've already given a flowpoint for this song! :stuck_out_tongue_closed_eyes:`;
};

var badFormatMsg = function(username){
  return `@${username} you need to use @[username] to give a flowpoint to someone`;
};

var noMultiAwarding = function(username){
  return `@${username} you can only give a flowpoint to one person`;
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