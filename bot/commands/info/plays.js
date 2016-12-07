'use strict';
var repo = require(process.cwd()+'/repo');
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var moment = require('moment');

/**
 * Command to show number of plays current song including last play info
 * @param  {Object} bot  dubapi instance
 * @param  {Object} db   Firebase instance
 * @param  {Object} data Room info object
 */
module.exports = function(bot, db, data) {
  var currentSong = mediaStore.getCurrent();
  
  repo.getSong(db, currentSong.id)
    .then(function(data){
      let val = data.val();
      if (val) {
        var when = moment(val.lastplay.when).fromNow();
        bot.sendChat(`${val.name} has been played ${val.plays} time(s), last played ${when} by ${val.lastplay.user}`);
      }
    }).catch(function(err){
      // maybe do something ¯\_(ツ)_/¯
    });

};