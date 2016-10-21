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

var roleRanks = [
  'creator',
  'owner',
  'manager',
  'mod',
  'vip',
  'residentdj',
  'staff'
];

module.exports = function(bot, user, minRole) {
  if (!bot || !user || !minRole) {
    bot.log('error', 'BOT', 'Missing arguments in roleChecker');
    return false; 
  }

  var rankEnd = roleRanks.indexOf(minRole.toLowerCase());
  
  if (rankEnd < 0) { 
    return false;
  }
  
  var ranks = roleRanks.slice(0, rankEnd + 1).reverse();

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