'use strict';
/**
 * Load new music monday in memory
 * and update it once every 30min
 */
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;
const schedule = require('node-schedule');
const MySheet = require(process.cwd() + '/bot/utilities/spreadsheet.js');

const SPREAD_ID = settings.spreadsheets.weekly_events;
const API_KEY = settings.spreadsheets.api_key;
let ff = new MySheet(SPREAD_ID, API_KEY);

function loadIntoMemory(bot){
  ff.getRows('FF ', 'A3:G')
    .then((rows)=>{
      let row1 = rows.shift();
      let convertedRows = ff.toObj(row1, rows).filter(o => o.Date && o.User && o.Theme);
      let nextUp = ff.getNext(convertedRows, 'Date');
      bot.sheetsData = bot.sheetsData || {};
      bot.sheetsData.ff = nextUp;
    })
    .catch((err)=>{
      bot.log('error','BOT', err);
    });
}

module.exports = {
  "load" : function(bot) {
    loadIntoMemory(bot);
  },
  "schedule" : function(bot) {
    // this will run every 30min
    this.scheduler = schedule.scheduleJob('*/30 * * * *', function(){
      loadIntoMemory(bot);
    });
  }
};
