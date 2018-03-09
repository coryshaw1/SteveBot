'use strict';
/**
 * Load new music monday in memory
 * and update it once an hour
 */
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;

const schedule = require('node-schedule');
const spreadsheet = require(process.cwd() + '/bot/utilities/spreadsheet');


function loadIntoMemory(bot) {
  spreadsheet.loadSheet(settings.spreadsheets.new_music_monday, 3)
    .then(function(rows){
      // console.log(rows);
      return spreadsheet.getNext(rows, 'date');
    })
    .then(function(row){
      bot.sheetsData = bot.sheetsData || {};
      bot.sheetsData.nmm = row;
    })
    .catch(function(err){
      bot.log('error', 'BOT', err);
    });
}

module.exports = function(bot){
  loadIntoMemory(bot);
  // this will run at the top of every hour
  var hourly = schedule.scheduleJob('0 * * * *', function(){
    loadIntoMemory(bot);
  });
};