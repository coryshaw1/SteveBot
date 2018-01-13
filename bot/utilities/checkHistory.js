'use strict';
const historyStore = require(process.cwd()+ '/bot/store/history.js');
const _ = require('lodash');

/**
 * Checks current playing song against room history and
 * gives a warning if song was played within a specific
 * time frame
 * 
 * @param {Object} bot 
 * @param {Object} data 
 * @returns 
 */
module.exports = function checkHistory(bot, data){
  if (!bot.myconfig.recently_played_warning || !historyStore.ready) {
    return;
  }

  // converting Hours to Milliseconds
  var limitInMS = bot.myconfig.recently_played_limit * (1000 * 60 * 60) ;

  var dj = _.get(data, 'user.username');
  var songName = _.get(data, 'media.name');
  var id = _.get(data, 'media.id');

  if (!id) { return; }

  // check history
  var check = historyStore.getSong(bot, data.media.id);
  
  if (check.length > 0) {
    // if the song was played OVER [limit] hours ago, do nothing
    if (Date.now() - check[0].lastplayed > limitInMS) {
      return;
    }

    var time = historyStore.convertTime(check[0].lastplayed);
    var msg;

    if (!dj) {
      msg = `FYI, there's a song in the queue that was played ${time}: *${songName}*`;
    } else {
      msg = `@${dj}, you have a song in the queue that was played ${time}: *${songName}*`;
    }

    if (time.toLowerCase().indexOf('seconds') >= 0) {
      bot.log('info', 'BOT', `Not Warned: ${dj} - ${songName} - ${time}`);
    } else {
      bot.sendChat(msg);
      dj = dj || 'dj';
      bot.log('info', 'BOT', `Warned: ${dj} - ${songName} - ${time}`);
    }
  }

  historyStore.save(bot, data);
};