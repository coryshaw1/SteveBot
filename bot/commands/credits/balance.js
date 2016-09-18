'use strict';
var repo = require(process.cwd()+'/repo');

function sayMyBalance(bot, user) {
  bot.sendChat(`@${user.username} you have ${user.hearts} :heart: and ${user.props} :musical_note: and ${user.flow} :oceans:!`);
}

function sayTheirBalance(bot, data, user) {
  bot.sendChat(`@${user.username}, the user @${user.username} has ${user.hearts} :heart: and ${user.props} :musical_note: and ${user.flow} :oceans:!`);
}

module.exports = function(bot, db, data) {

  if (typeof(data.params) === 'undefined' && data.params.length <= 0) {
    bot.sendChat(`@${data.user.username} you can only lookup one person`);
    return;
  }
      
  if (data.params.length !== 1) {
    bot.sendChat(`@${data.user.username} you need to @[username] to lookup someone`);
    return;
  }

  if (data.params[0].substr(0, 1) === '@') {
    
    if(data.params[0] === '@' + data.user.username) {
      repo.findUserById(db, data.user.id, function(user){
        if(!user.hearts) { user.hearts = 0; }
        if(!user.props) { user.props = 0; }
        if (!user.flow) { user.flow = 0; }
        sayMyBalance(bot, user);
      });

    } else {
      var recipient = bot.getUserByName(data.params[0].replace('@', ''), true);
      
      if(!recipient){
        bot.sendChat(`@{data.user.username}, the user ${data.params[0]} was not found!`);
        return;
      }

      return repo.findUserById(db, recipient.id, function(user){
        if (user !== null) {
          if(!user.hearts) { user.hearts = 0; }
          if(!user.props) { user.props = 0; }
          if (!user.flow) { user.flow = 0; }
          sayTheirBalance(bot, data, user);
        }
      });
      
    }

    return;
  }

  repo.findUserById(db, data.user.id, function(user){
    if (user !== null) {
      if(!user.hearts) { user.hearts = 0; }
      if(!user.props) { user.props = 0; }
      if (!user.flow) { user.flow = 0; }
      sayMyBalance(bot, user);
    }
  });

};