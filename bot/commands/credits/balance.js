'use strict';
var repo = require(process.cwd()+'/repo');

function sayMyBalance(bot, user) {
  bot.sendChat(`@${user.username} you have ${user.hearts} :heart: and ${user.props} :musical_note: and ${user.flow} :surfer:`);
}

function sayTheirBalance(bot, whoAsked, user) {
  bot.sendChat(`@${whoAsked}, the user @${user.username} has ${user.hearts} :heart: and ${user.props} :musical_note: and ${user.flow} :surfer:`);
}

function lookUpBalance(bot, db, whoAsked, whoFor, which){
  repo.findUserById(db, whoFor.id, function(user){
    if (user !== null) {
      if (!user.hearts) { user.hearts = 0; }
      if (!user.props) { user.props = 0; }
      if (!user.flow) { user.flow = 0; }
      
      if (!which || which === 'mine' ) {
        sayMyBalance(bot, user);
      } else {
        sayTheirBalance(bot, whoAsked,  user);
      }
    } else {
      bot.sendChat(`Strange, data for that was not found!`);
    }
    
  });
}

module.exports = function(bot, db, data) {

  if (typeof(data.params) === 'undefined' || data.params.length === 0) {
    return lookUpBalance(bot, db, data.user.username, data.user, 'mine');
  }

  if (data.params.length > 1) {
    return bot.sendChat(`@${data.user.username} you can only lookup one person`);
  }

  if (data.params.length === 1 && data.params[0].substr(0, 1) !== '@') {
    return bot.sendChat(`@${data.user.username}, use '!balance @[username]' to check another user's balance`);
  }

  if (data.params.length === 1 && data.params[0].substr(0, 1) === '@') {
    var recipient = bot.getUserByName(data.params[0].replace('@', ''), true);

    if(!recipient){
      bot.sendChat(`@${data.user.username}, the user ${data.params[0]} was not found!`);
      return;
    }

    return lookUpBalance(bot, db, data.user.username, recipient, 'theirs');
  }

};