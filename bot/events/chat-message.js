/***************************************************************
 * Event: chat-message
 *
 * Event fired for every new chat message
 */
'use strict';
const fs = require('fs');
const path = require('path');
const triggerPoint = require(process.cwd()+ '/bot/utilities/triggerPoint.js');
const triggerStore = require(process.cwd()+ '/bot/store/triggerStore.js');
const triggerCode = require(process.cwd() + '/bot/utilities/triggerCode.js');

/**
 * @typedef {import('firebase-admin').database} DB
 */

/**
 * @typedef {{trigger: string; params: string[]}} TriggerData
 */

/**
 * @type {{ [key: string]: (bot: DubAPI, db: DB, data: {} ) => void }}
 */
const commands = {};
const localCommands = process.cwd() + '/bot/commands';

/**
 * 
 * @param {string} dir 
 */
var walk = function(dir) {
  //cache all the commands here by auto requiring them and passing the bot
  //supports directories no matter how deep you go.
  fs.readdirSync(dir).forEach(function(file) {
    var _path = path.resolve(dir, file);
    fs.stat(_path, function(err, stat) {
        if (stat && stat.isDirectory()) {
            walk(_path);
        } else {
          if (file.indexOf('.js') > -1) {
              // add commands set in file if they exist
              if(typeof(require(_path).extraCommands) !== 'undefined'){
                  if(Array.isArray(require(_path).extraCommands)){
                    // add each command in array into overall commands
                    
                    /**
                     * @param {string} command 
                     */
                    function onEachCommand(command){
                      commands[command] = require(_path);
                    }
                    
                    require(_path).extraCommands.forEach(onEachCommand);
                  } else {
                    throw new TypeError('Invalid extraCommands export for file: ' + _path);
                  }
              }

              commands[file.split('.')[0]] = require(_path);
          }
        }
    });
  });
};

/**
 * 
 * @param {DubAPI} bot 
 * @param {string} trigger 
 * @returns {void}
 */
function unrecognized(bot, trigger) {
  let msg = `*!${trigger}* is not a recognized trigger. `;
  
  let results = triggerStore.recursiveSearch(trigger, 5);
  
  if (!results || results.length === 0) {
    return bot.sendChat(msg);
  }

  let moreMsg = "Did you mean one of these: ";
  if (results.length === 1) {
    moreMsg = "Did you mean this:  ";
  }
  moreMsg += results.join(', ');
  return bot.sendChat(msg + moreMsg);
}

/**
 * 
 * @param {DubAPI} bot 
 * @param {import('firebase-admin').database} db 
 * @param {TriggerData} data 
 * @returns 
 */
const handleCommands = function(bot, db, data) {
  // first go through the commands in /commands to see if they exist
  if (typeof(commands[data.trigger]) !== 'undefined'){
    
    // disbaling raffles for now, might do this via some kind of global config later
    if (data.trigger === 'raffle' || data.trigger === 'join') {
      return bot.sendChat('Raffles have been disabled, gambling is a serious problem!');
    }
    return commands[data.trigger](bot, db, data);
  }

  /* 
    handle trigger concatenation like:
    !myTrigger += something something
  */
  if (data.params && data.params.length > 1 && data.params[0] === '+=') {
    /**
     * first find the trigger
     * @param {string} trig 
     * @returns 
     */
    function onGetFirstTrig(trig){
      if (trig) {
        triggerStore.append(bot, db, data, trig);
      } else {
        return unrecognized(bot, data.trigger);
      }
    }
    triggerStore.get(bot, db, data, onGetFirstTrig, true);
    return;
  }
  
  /**
   * @param {string} trig 
   */
  function onGetExistingTrig(trig){
    if (trig !== null) {
      
      // if this is a special code trigger that is wrapped in brackets "{ }"
      if (/^\{.+\}$/.test(trig)) {
        triggerCode(bot, trig, data);
        return;
      }

      const last = trig.split(" ").pop();
      const pointCheck = new RegExp("\\+(props?|flow)(=[a-z0-9_-]+)?", "i");
      if (last && pointCheck.test(last)) {
        return triggerPoint(bot, db, data, trig, last);
      } else {
        return bot.sendChat(trig);
      }
    } else {
      return unrecognized(bot, data.trigger);
    }
  }

  // check if it's an exsiting trigger
  triggerStore.get(bot, db, data, onGetExistingTrig);

};

/**
 * 
 * @param {DubAPI} bot 
 * @param {import('firebase-admin').database} db 
 */
module.exports = function(bot, db) {
    
  walk(localCommands);
  
  bot.on(bot.events.chatMessage, function(data) {
    const cmd = data.message.trim();

    //split the whole message words into tokens
    const [trigger, ...other] = cmd.split(' ');

    if (trigger && trigger.startsWith('!')) {
      data.trigger = trigger.substring(1).toLowerCase();
      
      //the params are an array of the remaining tokens
      data.params = other;
      return handleCommands(bot, db, data);
    }
  });
};
