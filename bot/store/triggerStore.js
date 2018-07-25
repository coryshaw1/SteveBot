'use strict';
var repo = require(process.cwd()+'/repo');
const roleChecker = require(process.cwd()+ '/bot/utilities/roleChecker.js');
const triggerFormatter = require(process.cwd()+ '/bot/utilities/trigger-formatter.js');
const triggerPoint = require(process.cwd()+ '/bot/utilities/triggerPoint.js');
const _ = require('lodash');
const fuzzy = require('fuzzy');

var TriggerStore = {
  triggers : {},
  propGivers : {},
  flowGivers : {},
  lastTrigger : {},


  getRandom : function (bot, data) {
    var trigKeys = Object.keys(this.triggers);
    var randKey = trigKeys[Math.floor((Math.random()*trigKeys.length))];
    var trig = this.triggers[randKey];
    var theReturn = null;
    if (trig){
      theReturn = triggerFormatter(trig.Returns, bot, data);
    }
    return {Trigger: trig.Trigger, Returns: theReturn};
  },

  randomProp : function() {
    var trigKeys = Object.keys(this.propGivers);
    var randKey = trigKeys[Math.floor((Math.random()*trigKeys.length))];
    return this.propGivers[randKey];
  },

  randomFlow : function() {
    var trigKeys = Object.keys(this.flowGivers);
    var randKey = trigKeys[Math.floor((Math.random()*trigKeys.length))];
    return this.flowGivers[randKey];
  },

  search : function(term, returnLimit) {
    if (!term || term ==='') {return [];}
    var trigKeys = Object.keys(this.triggers);
    var finds = fuzzy.filter(term, trigKeys);
    if (returnLimit) {
      finds = finds.slice(0,returnLimit);
    }
    return finds.map(function(el) { return el.string.replace(/\:$/, ''); });
  },

  recursiveSearch : function(term, returnLimit) {
    if (!term || term ==='') {return [];}
    var trigKeys = Object.keys(this.triggers);
    var finds = fuzzy.filter(term, trigKeys);
    if (finds.length === 0 && term.length > 3) {
      term = term.slice(0, term.length-1);
      return this.recursiveSearch(term, returnLimit);
    }
    if (returnLimit) {
      finds = finds.slice(0,returnLimit);
    }
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

  updateGivers : function(trig) {
    let val = trig.Returns;

    // because there was a trigger that returned as a num
    if (typeof val === 'number') {
      val = val+''; // coerce to a number
    }
    // just in case it's not still not a string
    if (typeof val !== 'string') { return; }

    if (val.indexOf('+flow') >= 0) {
      this.flowGivers[trig.Trigger] = trig;
    } else if (val.indexOf('+prop') >= 0) {
      this.propGivers[trig.Trigger] = trig;
    }
  },

  setTriggers : function(bot, val) {
    bot.log('info', 'BOT', 'Trigger cache updated');
        // reorganize the triggers in memory to remove the keys that Firebase makes
    Object.keys(val).forEach((key)=>{
      var thisTrig = val[key];
      thisTrig.fbkey = key;
      this.triggers[thisTrig.Trigger] = thisTrig;
      
      this.updateGivers(thisTrig);
    });
  },

  removeTrigger : function(triggerName) {
    if (this.triggers[triggerName]) {
      delete this.triggers[triggerName];
    }
  },

  init : function(bot, db){
    var triggers = db.ref('triggers');

    // Get ALL triggers and store them locally
    // this will run everytime a trigger is updated or created
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
    lastTrigger.on('value', (snapshot)=>{
      var val = snapshot.val();
      bot.log('info', 'BOT', 'lastTrigger updated');
      this.lastTrigger = val;
    }, function(error){
        bot.log('error', 'BOT', 'error getting lastTrigger from firebase');
    });

  }
};

module.exports = TriggerStore;

