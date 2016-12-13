/***************************************************************
 * This event is fired when the queue is updated either by
 * someone joining it, someone leaving it, someone reordering it,
 * someone changing one of their own queued songs, etc, etc
 */

'use strict';
const historyStore = require(process.cwd()+ '/bot/store/history.js');
const queue = require(process.cwd()+ '/bot/utilities/dj.js');
const _ = require('lodash');
const repo = require(process.cwd()+'/repo');

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

function searchUsersObj(bot, username) {
  for (let key in bot.allUsers) {
    if (bot.allUsers[key].username === username) {
      return [key, bot.allUsers[key]];
    }
  }
}

function checkNewUser(bot, db, user) {
  let cachedUser = searchUsersObj(bot, user.username);
  if (cachedUser && user.dubs <= 20 && !cachedUser[1].introduced) {
    // console.log(user.username, user.dubs, cachedUser[1].introduced);

    bot.sendChat(`${user.username} is new to the mixer, and just joined the queue. Let's all be supportive!`);
    cachedUser[1].introduced = true;
    repo.updateUser(db, cachedUser[0], cachedUser[1], function(err){
      if (err) {
        bot.log('error', 'REPO', `Error updating introduced for user ${user.username}`);
      }
    });
  }
}

module.exports = function(bot, db) {
  bot.on(bot.events.roomPlaylistQueueUpdate, function(data) {
    if (!data) {
      return bot.log('error', 'BOT', 'roomPlaylistQueueUpdate: data object missing');
    }

    if (!Array.isArray(data.queue)) {
      return bot.log('error', 'BOT', 'queue is not an array');
    }

    if (data.queue.length > 0) {
      data.queue.forEach(function(q){
        checkHistory(bot, q);
        checkNewUser(bot, db, q.user);
      });
    }

    // join the queue when no one is in it
    if (data.queue.length === 0) {
      bot.sendChat("Looks like no one is in the queue, guess I'll take over for a while");
      queue.join(bot, function(code,_data, extra){
        if (code === 200) {
          bot.log('info', 'BOT', 'Successfully joined the queue when no one was in it');
          bot.isDJing = true;
          bot.commandedToDJ = false;
        } else {
          bot.log('error','BOT', 'Could not un-pause my queue');
        }
      });
      return;
    }

    // leave the queue when when a new person joins it
    if (data.queue.length > 1 && bot.isDJing && !bot.commandedToDJ) {
      bot.sendChat("Leaving the queue now that other DJs are in it");
      queue.leave(bot, function(code, _data, extra){
        if (code === 200) {
          bot.log('info', 'BOT', 'Successfully cleared my queue');
        } else {
          bot.log('error','BOT', `Could not clear the queue - ${code} ${_data}`);
        }
      });
    }

  });
};