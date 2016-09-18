'use strict';
var repo = require(process.cwd()+'/repo');

function checkLeaders(bot, db, data, type, msgPrefix, msgNone){
  repo.getLeaders(db, type, 3, function(items){
    var currentChat = msgPrefix;
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
    bot.sendChat(currentChat);
  });
}

module.exports = function(bot, db, data) {
  
  var propsChat = 'By *!tune* or *!props* :musical_note: : ';
  var propsNone = 'nobody got props, lame!';
  checkLeaders(bot, db, data, 'props', propsChat, propsNone);

  
  var heartsChat = 'By *!love* :heart: : ';
  var heartNone = 'nobody got any love :crying_cat_face:';
  checkLeaders(bot, db, data, 'hearts', heartsChat, heartNone);

  var flowChat = 'By *!flowpoint* :ocean: : ';
  var flowNone = 'no flow leaders? DJs all must be AFK';
  checkLeaders(bot, db, data, 'flow', flowChat, flowNone);

};

