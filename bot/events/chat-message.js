'use strict';

var fs = require('fs');
var path = require('path');
var triggers = require('../triggers.js');
var commands = {};
var localCommands = process.cwd() + '/bot/commands';

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
                      require(_path).extraCommands.forEach(function(command){
                          commands[command] = require(_path);
                      });
                  }
                  else {
                      throw new TypeError('Invalid extraCommands export for file: ' + _path);
                  }
              }

              commands[file.split('.')[0]] = require(_path);
          }
        }
    });
  });
};

var handleCommands = function(bot, db, data, parsedCommands) {
  
  // first go through the commands in /commands to see if they exist
  if (typeof(commands[data.trigger]) !== 'undefined'){
    
    // disbaling raffles for now, might do this via some kind of global config later
    if (data.trigger === 'raffle' || data.trigger === 'join') {
      return bot.sendChat('Raffles have been disabled, gambling is a serious problem');
    }

    return commands[data.trigger](bot, db, data);
  } 

  if (parsedCommands.length === 1) {
    triggers(bot, db, data, function(trig){
        if (trig !== null) { 
          bot.sendChat(trig); 
        }
    });
  }
};

module.exports = function(bot, db) {
    
  walk(localCommands);
  bot.on(bot.events.chatMessage, function(data) {
    var cmd = data.message,
        //split the whole message words into tokens
        tokens = cmd.split(' '),
        // array of the command triggers
        parsedCommands = [];
    
    //command handler
    tokens.forEach(function(token) {
        if (token.charAt(0) === '$') {
          bot.sendChat('RIP @mixerbot, we will never forget you.');
          bot.sendChat('http://i.imgur.com/xyny6OZ.gif');
        }

        if (token.charAt(0) === '!' && parsedCommands.indexOf(token.substr(1)) === -1) {
            
          // add the command used to the data sent from the chat to be used later
          data.trigger = token.substr(1).toLowerCase();
          
          parsedCommands.push(data.trigger);

          //if very first token, it's a command and we can grab the
          //params (if any) and add to the data sent from chat
          if (tokens.indexOf(token) === 0) {
              //the params are an array of the remaining tokens
              data.params = tokens.slice(1);
              
              //execute the command
              handleCommands(bot, db, data, parsedCommands);
          }
        }
    });
  });
};
