/***************************************************************
 * This event is fired when the queue is updated either by
 * someone joining it, someone leaving it, someone reordering it,
 * someone changing one of their own queued songs, etc, etc
 */

'use strict';
var historyStore = require(process.cwd()+ '/bot/store/history.js');
var _ = require('lodash');

function checkHistory(bot, data){
  if (!historyStore.ready) {
    return;
  }

  var dj = _.get(data, 'user.username');
  var songName = _.get(data, 'media.name');
  var id = _.get(data, 'media.id');

  if (!id) { return; }

  // check history
  var check = historyStore.getSong(bot, data.media.id);
  
  if (check.length > 0) {
    var time = historyStore.convertTime(check[0].lastplayed);
    var msg;

    if (!dj) {
      msg = `FYI, there's a song in the queue that was played ${time}: *${songName}*`;
    } else {
      msg = `@${dj}, you have a song in the queue that was played ${time}: *${songName}*`;
    }

    bot.sendChat(msg);
    dj = dj || 'dj';
    bot.log('info', 'BOT', `Warned: [${dj} - ${songName} - ${time}]`);
  }

  historyStore.save(bot, data);
}

function checkNewUser(bot, user) {
  console.log(user.username, user.dubs);
}

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistQueueUpdate, function(data) {
    if (!data) {
      return bot.log('error', 'BOT', 'roomPlaylistQueueUpdate: data object missing');
    }

    if (Array.isArray(data.queue) && data.queue.length > 0) {
      data.queue.forEach(function(q){
        checkHistory(bot, q);
        checkNewUser(bot, q.user);
      });
    }
  });
};