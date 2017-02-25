'use strict';
var repo = require(process.cwd()+'/repo');
const roleChecker = require(process.cwd()+ '/bot/utilities/roleChecker.js');
const _ = require('lodash');

var TriggerStore = {
  triggers : {},
  lastTrigger : {},

  getLast: function(){
    return this.lastTrigger;
  },

  get: function(bot, db, data, callback) {
    var theReturn = null;
    if (this.triggers[data.trigger.toLowerCase() + ":"]) {
      theReturn = this.triggers[data.trigger + ":"].Returns;
    }

    if (theReturn){
      if (theReturn.indexOf('%dj%') >= 0){
        // replace with current DJ name
        theReturn = theReturn.replace('%dj%', '@' + bot.getDJ().username);
      }
      if (theReturn.indexOf('%me%') >= 0) {
        // replace with user who entered chat name
        theReturn = theReturn.replace('%me%', data.user.username);
      }
    }

    if (typeof callback === 'function') {
      return callback(theReturn);
    }
  },

  append: function(bot, db, data, callback) {
    // if not at least a MOD, GTFO!
    if ( !roleChecker(bot, data.user, 'mod') ) {
      return bot.sendChat('Sorry only mods (or above) can do this');
    }

    if (!this.triggers[data.trigger + ":"]) {
      return bot.sendChat(`The trigger !${data.trigger} does not exist, ergo you can not append to it`);
    }

    var triggerObj =  _.clone(this.triggers[data.trigger + ":"]);
    var fbkey = triggerObj.fbkey;
    delete triggerObj.fbkey;

    // append our extra text for this trigger
    triggerObj.Returns += " " + data.triggerAppend;

    repo.updateTrigger(db, data, fbkey, triggerObj)
      .then(function(){
        bot.log('info', 'BOT', `[TRIG] APPEND by ${data.user.username} -> !${data.trigger} -> ${data.triggerAppend}`);
        bot.sendChat(`trigger for *!${data.trigger}* appended!`);
        if (typeof callback === 'function') {
          callback();
        }
      })
      .catch(function(err){
        if (err) { 
          bot.log('error', 'BOT',`[TRIG] APPEND ERROR: !${data.trigger} - ${err.code}`);
          bot.sendChat(`internal error updating trigger *!${data.trigger}*, try again or contact "IT" support.`);
          if (typeof callback === 'function') {
            callback(err);
          }
        }
      });
  },

  init : function(bot, db){
    var self = this;
    
    var triggers = db.ref('triggers');
    triggers.on('value', function(snapshot){
        var val = snapshot.val();
        bot.log('info', 'BOT', 'Trigger cache updated');
        // reorganize the triggers in memory to remove the keys that Firebase makes
        Object.keys(val).forEach((key)=>{
          var thisTrig = val[key];
          thisTrig.fbkey = key;
          self.triggers[thisTrig.Trigger] = thisTrig;
        });
      }, function(error){
        bot.log('error', 'BOT', 'error getting triggers from firebase');
    });

    var lastTrigger = db.ref('lastTrigger');
    lastTrigger.on('value', function(snapshot){
      var val = snapshot.val();
      bot.log('info', 'BOT', 'lastTrigger updated');
      self.lastTrigger = val;
    }, function(error){
        bot.log('error', 'BOT', 'error getting lastTrigger from firebase');
    });

  }
};

module.exports = TriggerStore;

