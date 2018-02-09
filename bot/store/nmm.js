'use strict';
/**
 * Load new music monday in memory
 * and update it once an hour
 */
const schedule = require('node-schedule');
const spreadsheet = require(process.cwd() + '/bot/utilities/spreadsheet');

function loadIntoMemory(bot) {
  spreadsheet.loadSheet('1R6zwrTjAyNQCTX2DAzgytL5xsAEji3Et7z5HrKxAg5g', 3)
    .then(function(rows){
      return spreadsheet.getNext(rows, 'month');
    })
    .then(function(row){
      bot.sheetsData = bot.sheetsData || {};
      bot.sheetsData.nnm = row;
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