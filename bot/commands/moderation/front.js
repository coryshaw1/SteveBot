'use strict';


module.exports = function(bot, db, data) {
  if(!bot.hasPermission(data.user, 'queue-order')) {
    return;
  }

  if (typeof(data.params) === "undefined" || data.params.length === 0) {
    bot.sendChat("@" + data.user.username + " you didn't select a user. You need to @[username] to move them to the front of the queue");
    return;
  }

  if (data.params.length > 1) {
    bot.sendChat("@" + data.user.username + " you can only move one person to the front of the queue at a time");
    return;
  }

  if (data.params[0].charAt(0) !== "@") {
    bot.sendChat("@" + data.user.username + " you need to @[username] to move them to the front of the queue");
    return;
  }
  
  // finally 
  var recipient = bot.getUserByName(data.params[0].replace("@",""));
  var queuePosition = bot.getQueuePosition(recipient.id);
  
  if (queuePosition > 0) {
    bot.moderateMoveDJ(recipient.id, 0, function(){});
  } else if (queuePosition === 0){
    bot.sendChat("@" + recipient.username + " is already at the front of the queue");
  } else{
    bot.sendChat("@" + recipient.username + " is not in the queue");
  }

};