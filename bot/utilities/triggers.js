'use strict';
var repo = require(process.cwd()+'/repo.js');
var roleChecker = require(process.cwd()+ '/bot/utilities/roleChecker.js');

function searchTriggerObj(bot, trigName) {
  for (let key in bot.allTriggers) {
    if (bot.allTriggers[key].Trigger === trigName + ':') {
      return bot.allTriggers[key].Returns;
    }
  }
}


module.exports = {

  get: function(bot, db, data, callback) {
    var theReturn = searchTriggerObj(bot, data.trigger);
    
    if (theReturn){
      
      if (theReturn.indexOf('%dj%') >= 0){
        // replace with current DJ name
        theReturn = theReturn.replace('%dj%', '@' + bot.getDJ().username);
      }
      if (theReturn.indexOf('%me%') >= 0) {
        // replace with user who entered chat name
        theReturn = theReturn.replace('%me%', data.user.username);
      }
      if (typeof callback === 'function') {
        return callback(theReturn);
      }
    }

    if (typeof callback === 'function') {
      return callback(null);
    }
  },

  append: function(bot, db, data, callback) {

    // if not at least a MOD, GTFO!
    if ( !roleChecker(bot, data.user, 'mod') ) {
      return bot.sendChat('Sorry only mods (or above) can do this');
    }

    // first we search for the existing trigger
    repo.getTrigger(bot, db, data.trigger, function(val){
        // if it exists then we can update it
        if (val !== null) {
          // get first key and its value
          let keys = Object.keys(val);
          let triggerKey = keys[0];
          // append our extra text for this trigger
          let triggerObj = val[keys[0]];
          triggerObj.Returns = triggerObj.Returns + " " + data.triggerAppend;

          return repo.updateTrigger(db, data, triggerKey, triggerObj)
            .then(function(){
              bot.log('info', 'BOT', `[TRIG] APPEND [${data.trigger} | ${data.user.username} | ${data.triggerAppend}]`);
              bot.sendChat(`trigger for *!${data.trigger}* appended!`);
              repo.logTriggerHistory(db, `${data.trigger} appended by ${data.user.username}`, data);
              if (typeof callback === 'function') {
                callback();
              }
            })
            .catch(function(err){
              if (err) { 
                bot.log('error', 'BOT',`[TRIG] ${data.trigger} - Error appending - ${err.code}`);
                bot.sendChat(`internal error updating trigger *!${data.trigger}*, try again or contact IT support.`);
                if (typeof callback === 'function') {
                  callback(err);
                }
              }
            });
        } else {
          bot.sendChat(`You can not append a trigger that does not exist`);
          if (typeof callback === 'function') {
            callback("trigger not found");
          }
        }

      });
  }
};

 

