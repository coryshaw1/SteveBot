'use strict';
var repo = require(process.cwd()+'/repo');

function searchTriggerObj(bot, trigName) {
  for (let key in bot.allTriggers) {
    if (bot.allTriggers[key].Trigger === trigName + ':') {
      return bot.allTriggers[key].Returns;
    }
  }
}

function findTrigger(bot, db, data, callback) {
  var theReturn = searchTriggerObj(bot, data.trigger);
  
  if (theReturn){
    
    if (theReturn.indexOf('%dj%') >= 0){
      // replace with current DJ name
      theReturn = theReturn.replace('%dj%', '@' + bot.getDJ().username);
    }
    if (theReturn.indexOf('%me%') >= 0) {
      // replace with user who entered chat name
      theReturn = theReturn.replace('%me%', data.user.username);
    }
    if (typeof callback === 'function') {
      return callback(theReturn);
    }
  }

  if (typeof callback === 'function') {
    return callback(null);
  }
}

module.exports = findTrigger;