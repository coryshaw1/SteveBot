'use strict';
/**
 * Load new music monday in memory
 * and update it once every 30min
 */
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;
const schedule = require('node-schedule');
const spreadsheet = require(process.cwd() + '/bot/utilities/spreadsheet');


function loadIntoMemory(bot) {
  spreadsheet.loadSheet(settings.spreadsheets.weekly_events, 2)
    .then((sheet)=>{
      return spreadsheet.getCells(sheet,3);
    })
    .then((sheet, cells)=>{
      console.log(cells);
      return spreadsheet.getRows(sheet,3);
    })
    .then(function(sheet, rows){
      // console.log(rows);
      return spreadsheet.getNext(rows, 'date');
    })
    .then(function(row){
      bot.sheetsData = bot.sheetsData || {};
      bot.sheetsData.ff = row;
    })
    .catch(function(err){
      bot.log('error', 'BOT', 'ff '+err);
    });
}

module.exports = {
  "load" : function(bot, rowOffset) {
    loadIntoMemory(bot);
  },
  "schedule" : function(bot) {
    // this will run every 30min
    this.hourly = schedule.scheduleJob('*/30 * * * *', function(){
      loadIntoMemory(bot);
    });
  }
};