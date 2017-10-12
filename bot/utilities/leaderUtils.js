'use strict';
const moment = require('moment');
const repo = require(process.cwd()+'/repo');

function getTop3(bot, prop) {
  var arr = [];
  var keys = Object.keys(bot.allUsers);
  keys.forEach(function(userId){
    arr.push(bot.allUsers[userId]);
  });
  // help from: http://stackoverflow.com/a/1129270/395414
  arr.sort(function (a,b) {
    if (a[prop] < b[prop]) { 
      return -1;
    }
    if (a[prop] > b[prop]) {
      return 1;
    }
    return 0;
  });
  arr.reverse();
  var finalArr = [];
  for (let i = 0; i < 3; i++) {
    finalArr.push(arr[i]);
  }
  return finalArr;
}

function updateLeaderboard(bot, db) {
  var year = moment().format('Y');
  var month = moment().format('MMM');
  var leaderObj = {
    month: month,
    year: year,
    props : '',
    propsObj : {},
    flow : '',
    flowObj : {}
  };
  
  var propsArr = [];
  var props = getTop3(bot, 'props');
  props.forEach(function(user){
    if (user.props > 0) {
      propsArr.push(user.username + ' (' + user.props + ')');
      leaderObj.propsObj[user.username] = user.props;
    }
  });
  if (propsArr.length === 0){
    leaderObj.props = 'nobody got any props';
  } else {
    leaderObj.props = propsArr.join(', ');
  }
  

  var flowArr = [];
  var flow = getTop3(bot, 'flow');
  flow.forEach(function(user){
    if (user.flow > 0) {
      flowArr.push(user.username + ' (' + user.flow + ')');
      leaderObj.flowObj[user.username] = user.props;
    }
  });
  if (flowArr.length === 0){
    leaderObj.flow = 'there are currently no flow leaders';
  } else {
    leaderObj.flow = flowArr.join(', ');
  }
  

  repo.insertLeaderMonth(db, month + year, leaderObj)
    .then(function() {
      bot.log('info', 'BOT', month + year + ': Leaderboard updated');
    })
    .catch(function(error) {
      bot.log('error', 'BOT', 'error updating leaderboard');
    });
}

module.exports = {
  getTop3 : getTop3,
  updateLeaderboard : updateLeaderboard
};