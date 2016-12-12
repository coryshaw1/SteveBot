/**
 * !leaders
 * returns the top 3 props and flow leaders
 */
'use strict';

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

function checkLeaders(bot, data, type, msgPrefix, msgNone){
  var currentChat = '';
  var propsArr = [];

  var top3 = getTop3(bot, type);
  top3.forEach(function(user){
    if (user[type] > 0) {
      propsArr.push(user.username + ' (' + user[type] + ')');
    }
  });

  if (propsArr.length === 0){
    currentChat += msgNone;
  } else {
    currentChat += propsArr.join(', ');
  }
  bot.sendChat(msgPrefix);
  bot.sendChat('> ' + currentChat);
}

module.exports = function(bot, data) {
  
  var propsChat = 'By !props, :heart:, :musical_note:, :fist:, :fire:, etc...';
  var propsNone = 'nobody got any props';
  checkLeaders(bot, data, 'props', propsChat, propsNone);

  var flowChat = 'By *!flowpoint* :surfer:';
  var flowNone = 'there are currently no flow leaders';
  checkLeaders(bot, data, 'flow', flowChat, flowNone);

};

