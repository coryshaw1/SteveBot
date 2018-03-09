'use strict';
/**
 * Loads spreadsheet data into memory
 */

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var moment = require('moment');

var sheetObj = {

  getNext(rows, dateCol) {
    var closestRow = null;

    // get today's day
    var a = moment(Date.now());

    rows.reverse().forEach((row)=>{
      if (!row[dateCol]) { return; }

      // check the date of the row in the spreadsheet
      var b = moment(row[dateCol], "M/D/YYYY");

      // check the difference in days between today and spreadsheet
      // positive int means event is in the future, 
      // 0 is today,
      // negative = event in the past
      var diff = b.diff(a, 'days');
      if (diff >= 0) {
        closestRow = row;
      }
    });

    if (closestRow) {
      return Promise.resolve(closestRow);
    } else {
      return Promise.reject('no rows found');
    }
  },

  loadSheet : function (urlID, sheetIndex) {
    var doc = new GoogleSpreadsheet(urlID);
    var sheet = {};
  
    return new Promise(function(resolve, reject){
      async.series(
        [
          function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
              if (err) {
                reject(err);
              }
              sheet = info.worksheets[sheetIndex];
              step();
            });
          },
          function workingWithRows(step) {
            // console.log(sheet);
            sheet.getRows({
              offset: 1
            }, function( err, rows ){
              resolve(rows);
              step();
            });
          }
      
      ], function(err){
          reject(err);
        }
      );
    });
  }
};

module.exports = sheetObj;