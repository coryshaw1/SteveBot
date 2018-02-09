'use strict';
/**
 * Loads spreadsheet data into memory
 */

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var moment = require('moment');

var sheetObj = {

  getNext(rows, dateCol) {
    var closest = null;
    var closestRow = null;
    var a = moment(Date.now());

    rows.forEach((row)=>{
      if (!row[dateCol]) { return; }

      var b = moment(row[dateCol], "M/D/YYYY");
      var diff = a.diff(b, 'days');
      // console.log( diff  );
      if (!closest) {
        closest = diff;
        closestRow = row;
      } else {
        if (diff > closest) { 
          closest = diff; 
          closestRow = row;
        }
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