'use strict';
var repo = require(process.cwd()+'/repo');

module.exports = function(bot, db, data) {
  
  // get Props leader info
  repo.propsLeaders(db, function(props){
    var propsChat = 'By *!tune* or *!props* :musical_note: : ';
    var propsArr = [];
    
    var keys = Object.keys(props);
    keys.forEach(function(userId){
      if (props[userId].props > 0) {
        propsArr.push(props[userId].username + ' (' + props[userId].props + ')');
      }
    });

    if (propsArr.length === 0){
      propsChat += 'nobody got props, lame!';
    } else {
      propsChat += propsArr.join(', ');
    }
    bot.sendChat(propsChat);
  });

  repo.heartsLeaders(db, function(hearts){
    var heartsChat = 'By *!love* :heart: : ';
    var heartArr = [];

    var keys = Object.keys(hearts);
    keys.forEach(function(userId){
      if (hearts[userId].hearts > 0) {
        heartArr.push( hearts[userId].username + ' (' + hearts[userId].hearts + ')' );
      }
    });

    if (heartArr.length === 0){
      heartsChat += 'nobody got any love :crying_cat_face:';
    } else {
      heartsChat += heartArr.join(', ');
    }
    bot.sendChat(heartsChat);
  });

  repo.flowLeaders(db, function(flowpoints){
    var flowChat = 'By *!flowpoint* :ocean: : ';
    var flowArr = [];

    var keys = Object.keys(flowpoints);
    keys.forEach(function(userId){
      if (flowpoints[userId].flow > 0) {
        flowArr.push(flowpoints[userId].username + ' (' + flowpoints[userId].flow + ')');
      }
    });

    if (flowArr.length === 0){
      flowChat += 'no flow leaders? DJs all must be AFK';
    } else {
      flowChat += flowArr.join(', ');
    }
    bot.sendChat(flowChat);
  });

};

