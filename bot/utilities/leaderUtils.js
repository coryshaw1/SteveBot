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
      leaderObj.flowObj[user.username] = user.flow;
    }
  });
  if (flowArr.length === 0){
    leaderObj.flow = 'there are currently no flow leaders';
  } else {
    leaderObj.flow = flowArr.join(', ');
  }
  

  repo.insertLeaderMonth(db, month + year, leaderObj)
    .then(function() {
      // bot.log('info', 'BOT', month + year + ': Leaderboard updated');
    })
    .catch(function(error) {
      bot.log('error', 'BOT', 'error updating leaderboard');
    });
}
/**
 * Work in progress
 * Update the All Time Leaders board
 * 
 * @param {Obect} bot instance of DubAPI
 */
function allTimeLeaders(bot) {
  if (!bot.leaderboard) {
    bot.sendChat("I don't have leader informtaion at the momemt but try again in a minute");
    return;
  }

  /* 
    Leaders object structure:
      month_year
        flowObj
          user1: total
          user2: total
          user3: total
        propsObj
          user1: total
          user2: total
          user3: total
  */


  var flows = {};
  var props = {};

  // build our list of flows and props 
  Object.keys(bot.leaderboard).forEach((key)=>{
    let month_year = bot.leaderboard[key];
    
    // add up all the flows
    for (let user in month_year.flowObj) {
      if (!flows[user]) { flows[user] = month_year.flowObj[user]; }
      else { flows[user] += month_year.flowObj[user]; }
    }

    // add up all the props
    for (let user in month_year.propsObj) {
      if (!props[user]) { props[user] = month_year.propsObj[user]; }
      else { props[user] += month_year.propsObj[user]; }
    }
  });

  // sort all the flows by this method: 
  // https://stackoverflow.com/a/1069840/395414
  var flow_sortable = [];
  for (let u in flows) {
    flow_sortable.push([u, flows[u]]);
  }

  var top3Flow = flow_sortable.sort(function(a, b) {
      return a[1] - b[1];
  }).reverse().slice(0, 3);

  // sort all the props
  var props_sortable = [];
  for (let u in props) {
    props_sortable.push([u, props[u]]);
  }

  var top3Props = props_sortable.sort(function(a, b) {
      return a[1] - b[1];
  }).reverse().slice(0, 3);

  return {
    props : top3Props,
    flows : top3Flow
  };
}

module.exports = {
  getTop3 : getTop3,
  updateLeaderboard : updateLeaderboard,
  allTimeLeaders: allTimeLeaders
};