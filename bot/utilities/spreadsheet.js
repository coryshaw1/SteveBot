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

  getRows : function(sheet, rowOffset=1) {
    return new Promise((resolve,reject)=>{
      sheet.getRows({
        offset: rowOffset
      }, function( err, rows ){
        if (err) {
          reject(err);
        } 
        resolve(sheet, rows);
      });
    });
  },

  getCells : function(sheet, rowOffset){
    return new Promise((resolve,reject)=>{
      sheet.getCells({
        'min-row': rowOffset,
        'max-row': rowOffset,
        'return-empty': true
      }, function(err, cells) {
        if (err) {
          reject(err);
        } 
        resolve(sheet, cells);
      });
    });
  },

  loadSheet : function (urlID, sheetIndex) {
    var doc = new GoogleSpreadsheet(urlID);

    return new Promise((resolve, reject) => {
      doc.getInfo(function(err, info) {
        if (err) {
          reject(err);
        }
        resolve(info.worksheets[sheetIndex]);
      });
    });
  }
};

module.exports = sheetObj;