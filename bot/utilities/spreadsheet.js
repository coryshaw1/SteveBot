'use strict';
/**
 * Loads spreadsheet data into memory
 */
var moment = require('moment');
const {google} = require('googleapis');

class MySheet {
  constructor(id, key) {
    this.sheetid = id;

    this.sheets = google.sheets({
      version: 'v4', 
      auth: key
    });
  }

  getRows(name, range) {
    return new Promise((resolve, reject)=>{
      this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetid,
        range: `${name}!${range}`
      }, (err, res) => {
        if (err) return reject(err);
        const rows = res.data.values;
        resolve(rows);
      });
    });

  }

  /**
   * take the returned row and convert it into an object
   * @param {array} headersRow 
   * @param {array} rows 
   */
  toObj(headersRow, rows) {
    headersRow = headersRow.map(h => h.replace(/ /g, '_'));
    return rows.map((row)=>{
      let obj = {};
      row.forEach((cell,i)=>{
        obj[headersRow[i]] = cell;
      });
      return obj;
    });
  }

  getNext(rows, dateCol) {
    var closestRow = 'no rows found';

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

    return closestRow;
  }

}

module.exports = MySheet;