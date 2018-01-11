'use strict';
var repo = require(process.cwd()+'/repo');
const roleChecker = require(process.cwd()+ '/bot/utilities/roleChecker.js');
const triggerFormatter = require(process.cwd()+ '/bot/utilities/trigger-formatter.js');
const _ = require('lodash');
const fuzzy = require('fuzzy');

var TriggerStore = {
  triggers : {},
  lastTrigger : {},

  random : function () {
    var trigKeys = Object.keys(this.triggers);
    var randKey = trigKeys[Math.floor((Math.random()*trigKeys.length))];
    return this.triggers[randKey];
  },

  search : function(term) {
    if (!term || term ==='') {return [];}
    var trigKeys = Object.keys(this.triggers);
    var finds = fuzzy.filter(term, trigKeys);
    return finds.map(function(el) { return el.string.replace(/\:$/, ''); });
  },

  getLast: function(){
    return this.lastTrigger;
  },
  
  /**
   * bot = dupapi object
   * db = instance of firebase repo middleman
   * data = data from dubapi chat
   * callback = fn
   * full [bool] = whether to return full trigger object or just the text
   */
  get: function(bot, db, data, callback, full) {
    var theReturn = null;
    if (this.triggers[data.trigger.toLowerCase() + ":"]) {
      theReturn = this.triggers[data.trigger + ":"];
    }

    if (theReturn && !full){
      theReturn = triggerFormatter(theReturn.Returns, bot, data);
    }

    if (typeof callback === 'function') {
      return callback(theReturn);
    }
  },

  append: function(bot, db, data, trig) {
    // if not at least a MOD, GTFO!
    if ( !roleChecker(bot, data.user, 'mod') ) {
      return bot.sendChat('Sorry only mods (or above) can do this');
    }

    if (!this.triggers[data.trigger + ":"]) {
      return bot.sendChat(`The trigger !${data.trigger} does not exist, ergo you can not append to it`);
    }

    // first we need to remove the "+=" from the array
    data.params.shift();
    // move the trigger name for existing updateTrigger function
    data.triggerName = data.trigger;
    // combine old trigger value with new trigger value
    data.triggerText = trig.Returns + ' ' + data.params.join(' ');

    // updateTrigger = function(db, data, triggerKey, orignialValue){
    repo.updateTrigger(db, data, data.trigger, trig)
        .then(function(){
          var info = `[TRIG] UPDATE: ${data.user.username} changed !${data.triggerName} FROM-> ${trig.Returns} TO-> ${data.triggerText}`;
          bot.log('info', 'BOT', info);
          bot.sendChat(`trigger for *!${data.triggerName}* updated!`);
        })
        .catch(function(err){
          if (err) { bot.log('error', 'BOT',`[TRIG] UPDATE ERROR: ${err}`); }
        });
  },

  setTriggers : function(bot, val) {
    bot.log('info', 'BOT', 'Trigger cache updated');
        // reorganize the triggers in memory to remove the keys that Firebase makes
    Object.keys(val).forEach((key)=>{
      var thisTrig = val[key];
      thisTrig.fbkey = key;
      this.triggers[thisTrig.Trigger] = thisTrig;
    });
  },

  removeTrigger : function(triggerName) {
    if (this.triggers[triggerName]) {
      delete this.triggers[triggerName];
    }
  },

  init : function(bot, db){
    var self = this;
    var triggers = db.ref('triggers');

    // Get ALL triggers and store them locally
    // do this only once on init
    triggers.on('value', (snapshot)=>{
        let val = snapshot.val();
        this.setTriggers.call(this,bot,val);
      }, (error)=>{
        bot.log('error', 'BOT', 'error getting triggers from firebase');
    });

    // remove deleted from local store of triggers
    triggers.on("child_removed", (snapshot)=>{
      let triggerDeleted = snapshot.val();
      if (typeof triggerDeleted !== "object" || !triggerDeleted.Trigger) { 
        bot.log('error', 'BOT', 'error from triggers child_removed event: ' + triggerDeleted);
        return; 
      }
      this.removeTrigger.call(this, triggerDeleted.Trigger);
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

