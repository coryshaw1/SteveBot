'use strict';

module.exports = function(bot, db, data) {
  var uid = data.user.id;
  var username = data.user.username;
  var queue = bot.getQueue();
  var boothTime = 0;
  var inQueue = false;

  for(var i = 0; i < queue.length; i++){
    if(queue[i].uid !== uid){
        boothTime += queue[i].media.songLength / 1000 / 60;
    } else {
      inQueue = true;
      break;
    }
  }

  if (!inQueue) {
    return bot.sendChat('@' + username + ', you\'re not currently in the queue!');
  }

  if (Math.round(boothTime) === 0) {
    return bot.sendChat('@' + username + ', your song will play at the end of this song!');
  }

  bot.sendChat('@' + username + ', your song will play in about ' + Math.round(boothTime) + ' minutes!');
};
