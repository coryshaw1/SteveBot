'use strict';
const _ = require('lodash');
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/*********************************************************************
  roleChecker,  kind of like hasPermission

  This module sets up a system to check a "minimum" access level
  because a user who has the role of "isManager" will fail a test for
  role "isMod", even though they are above that role.  So this will
  go through all the roles above given minimum role until it one passes
  of all are checked
*/

// placing role in order where index 0 is highest role
// and the larger index is lowest role
var roleRanks = [
  'creator', // [0] <-- highest role
  'owner',
  'manager',
  'mod',
  'vip',
  'residentdj',
  'staff' // [6] <-- lowest role
];

module.exports = function(bot, user, minRole) {
  // trying to minimize the amount of bot crashing due to possible missing user data from api
  if (!bot || !user || !minRole) {
    bot.log('error', 'BOT', 'Missing arguments in roleChecker');
    return false; 
  }

  // get the index of the mininum role from our roleRanks
  var rankEnd = roleRanks.indexOf(minRole.toLowerCase());
  
  // not even a valid role, GTFO ;-)
  if (rankEnd < 0) { 
    return false;
  }
  
  // create a new array with just the ranks starting at minRole and above
  var ranks = roleRanks.slice(0, rankEnd + 1).reverse();

  // loop through the different "bot.is[RANK]" methods until one of them returns true
  // examples: bot.isMod, bot.isOwner, etc.
  var hasRole = false;
  for (var i = 0; i < ranks.length; i++) {
    
    var chk = 'is' + capitalize(ranks[i]);
    if (ranks[i] === 'vip') {chk = 'isVIP'; }
    if (ranks[i] === 'residentdj') {chk = 'isResidentDJ'; }

    if (bot[chk](user)) {
      hasRole = true;
      break;
    }
  }

  return hasRole;
};