'use strict';
var repo = require(process.cwd()+'/repo');
var roleChecker = require(process.cwd()+ '/bot/utilities/roleChecker.js');
var Verifier = require(process.cwd()+ '/bot/utilities/verify.js');

function displayHelp(bot){
  bot.sendChat('*create/update:* !trigger trigger_name trigger_text');
  bot.sendChat('*delete:* !trigger trigger_name');
  bot.sendChat('Don\'t add the "!" before trigger_name');
}

function noExc(bot) {
  bot.sendChat("leave out the \"!\".");
  bot.sendChat("*Don't* do this: !trigger !stupidface.");
  bot.sendChat("*Do* this: !trigger stupidface");
}

module.exports.extraCommands = ['triggers'];
module.exports = function(bot, db, data) {
  const chatID = data.id;
  
  if (!data || !data.user || !data.user.username) {
    bot.log('error', 'BOT', '[TRIG] ERROR: Missing data or username');
    return bot.sendChat('An error occured, try again');
  }

  // if just "!trigger" was used then we show the help info for using it
  if (data.params === void(0) || data.params.length < 1) {
    return displayHelp(bot);
  }

  data.triggerName = data.params[0];
  data.triggerText = data.params.slice(1).join(' ');

  repo.getTrigger(bot, db, data.triggerName, function(val){
    
    /*********************************************************
     * Create Trigger
     * min role:  Resident DJs
     */
    if (val === null && data.params.length > 1) {

      if ( !roleChecker(bot, data.user, 'residentdj') ) {
        bot.sendChat('Sorry only ResidentDJs and above can create triggers');
        return;
      }

      // scold user for not doing it right
      if (data.params[0].charAt(0) === '!') {
        return  noExc(bot);
      }

      return repo.insertTrigger(db, data)
        .then(function(){
          var inf = `[TRIG] ADDED by ${data.user.username} -> !${data.triggerName} -> ${data.triggerText}`;
          bot.log('info', 'BOT', inf);
          bot.moderateDeleteChat(chatID, function(){});
          bot.sendChat(`trigger for *!${data.triggerName}* created, try it out!`);
        })
        .catch(function(err){
          if (err) { bot.log('error', 'BOT',`[TRIG] ADD: ${err}`);}
        });
    }

    // everything below this block is mod only action
    if ( !roleChecker(bot, data.user, 'mod') ) {
      bot.sendChat('Sorry only Mods and above can update or delete a triggers');
      return;
    }

    // scold user for not doing it right
    if (data.params[0].charAt(0) === '!') {
      return  noExc(bot);
    }

    if (val === null && data.params.length === 1) {
      // trying to delete a trigger that doesn't exist
      return bot.sendChat('You can\'t delete a trigger that doesn\'t exist');
    }

    /*********************************************************
     * Update Trigger
     * min role:  Mods
     */
    var keys;
    var foundTrigger;
    if (val !== null && data.params.length > 1) {
      keys = Object.keys(val);
      foundTrigger = val[keys[0]];
      return repo.updateTrigger(db, data, keys[0], foundTrigger)
        .then(function(){
          var info = `[TRIG] UPDATE: ${data.user.username} changed !${data.triggerName} FROM-> ${foundTrigger.Returns} TO-> ${data.triggerText}`;
          bot.log('info', 'BOT', info);
          bot.moderateDeleteChat(chatID, function(){});
          bot.sendChat(`trigger for *!${data.triggerName}* updated!`);
        })
        .catch(function(err){
          if (err) { bot.log('error', 'BOT',`[TRIG] UPDATE ERROR: ${err}`); }
        });
    }

    /*********************************************************
     * Delete Trigger Section
     * min role:  Mods
     */
    if (val !== null && data.params.length === 1) {
      keys = Object.keys(val);

      let verify = new Verifier(bot, data, 'delete trigger ' + data.triggerName);
      
      verify
        .then((userChoice)=>{
          if (!userChoice) {
            bot.sendChat(`ok, \`${data.triggerName}\` trigger delete canceled`);
            return;
          }

          repo.deleteTrigger(db, keys[0], val[keys[0]])
            .then(function(){
              var info = `[TRIG] DEL by ${data.user.username} -> !${data.triggerName}`;
              bot.log('info', 'BOT', info);
              bot.sendChat(`Trigger for *!${data.triggerName}* deleted`);
            })
            .catch(function(err){
              if (err) { bot.log('error', 'BOT', `[TRIG] DEL ERROR: ${err}`); }
            });
        })
        .catch(()=>{
          bot.log('info', 'BOT', `${data.triggerName} - trigger delete cancelled by timeout`);
        });
    }


  });

};