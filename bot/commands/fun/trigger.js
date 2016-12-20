'use strict';
var repo = require(process.cwd()+'/repo');
var roleChecker = require(process.cwd()+ '/bot/utilities/roleChecker.js');
const _ = require('lodash');

function displayHelp(bot){
  bot.sendChat('*usage:* !trigger <trigger_name> <trigger_text>');
  bot.sendChat('Don\'t add the "!" when creating a trigger');
}

module.exports = function(bot, db, data) {
  const userName = _.get(data, 'user.username');
  
  if (!data || !data.user || !data.user.username) {
    bot.log('error', 'BOT', '[TRIG] ERROR [Missing data or username]');
    return bot.sendChat('An error occured, try again');
  }

  if (data.params === void(0) || data.params.length < 1) {
    return displayHelp(bot);
  }

  // if not at least a MOD, GTFO!
  if ( !roleChecker(bot, data.user, 'mod') ) {
    bot.sendChat('Ah ah ah, only mods can do this');
    return bot.sendChat('https://media.giphy.com/media/uOAXDA7ZeJJzW/giphy.gif');
  }

  if (data.params[0].charAt(0) === '!') {
    displayHelp(bot);
    return;
  }

  data.triggerName = data.params[0];
  data.triggerText = data.params.slice(1).join(' ');

  repo.getTrigger(bot, db, data.triggerName, function(val){
    
    if (val === null && data.params.length > 1) {
      // creating a new trigger
      return repo.insertTrigger(db, data)
        .then(function(){
          var inf = `[TRIG] ADD [${data.triggerName} | ${data.user.username} | ${data.triggerText}]`;
          bot.log('info', 'BOT', inf);
          bot.sendChat(`trigger for *!${data.triggerName}* created, try it out!`);
          repo.logTriggerHistory(db, `${data.triggerName} created by ${data.user.username}`, data);
        })
        .catch(function(err){
          if (err) { bot.log('error', 'BOT',`[TRIG] DEL ADD: ${err}`);}
        });
    }

    if (val === null && data.params.length === 1) {
      // trying to delete a trigger that doesn't exist
      return bot.sendChat('You can\'t delete a trigger that doesn\'t exist');
    }

    var keys;
    if (val !== null && data.params.length > 1) {
      // updating an existing trigger
      keys = Object.keys(val);
      return repo.updateTrigger(db, data, keys[0], val[keys[0]])
        .then(function(){
          var info = `[TRIG] CHANGED [${data.triggerName} | ${data.user.username} | ${data.triggerText}]`;
          bot.log('info', 'BOT', info);
          bot.sendChat(`trigger for *!${data.triggerName}* updated!`);
          repo.logTriggerHistory(db, `${data.triggerName} updated by ${data.user.username}`, data);
        })
        .catch(function(err){
          if (err) { bot.log('error', 'BOT',`[TRIG] DEL CHANGED: ${err}`); }
        });
    }

    if (val !== null && data.params.length === 1) {
      // deleting a trigger
      keys = Object.keys(val);
      return repo.deleteTrigger(db, keys[0])
        .then(function(){
          var info = `[TRIG] DEL [${data.triggerName} | ${data.user.username}]`;
          bot.log('info', 'BOT', info);
          bot.sendChat(`Trigger for *!${data.triggerName}* deleted`);
          repo.logTriggerHistory(db, `${data.triggerName} deleted by ${data.user.username}`, data);
        })
        .catch(function(err){
          if (err) { bot.log('error', 'BOT', `[TRIG] DEL ERROR: ${err}`); }
        });
    }


  });

};