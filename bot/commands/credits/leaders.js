'use strict';
var repo = require(process.cwd()+'/repo');

function checkLeaders(bot, db, data, type, msgPrefix, msgNone){
  repo.getLeaders(db, type, 3, function(items){
    var currentChat = '';
    var propsArr = [];
    
    var keys = Object.keys(items);
    keys.forEach(function(userId){
      if (items[userId][type] > 0) {
        propsArr.push(items[userId].username + ' (' + items[userId][type] + ')');
      }
    });

    if (propsArr.length === 0){
      currentChat += msgNone;
    } else {
      currentChat += propsArr.join(', ');
    }
    bot.sendChat(msgPrefix);
    bot.sendChat('> ' + currentChat);
  });
}

module.exports = function(bot, db, data) {
  
  var propsChat = 'By !props, :heart:, :musical_note:, :fist:, :fire:, etc...';
  var propsNone = 'nobody got any props';
  checkLeaders(bot, db, data, 'props', propsChat, propsNone);

  var flowChat = 'By *!flowpoint* :surfer:';
  var flowNone = 'there are currently no flow leaders';
  checkLeaders(bot, db, data, 'flow', flowChat, flowNone);

};

