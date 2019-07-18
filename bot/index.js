'use strict';
require('./extend/array-extensions.js');
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;
const svcAcct = _private.svcAcct;

var DubAPI = require('dubapi');
var Database = require(process.cwd() + '/bot/db.js');
var config = require(process.cwd() + '/bot/config.js');

config.botName = settings.USERNAME;
var BASEURL = settings.FIREBASE.BASEURL;
var db = new Database(svcAcct, BASEURL);

/**
 * Add my own extensions
 */
DubAPI.prototype.getRoomHistory = require(process.cwd() + '/bot/extend/getRoomHistory.js');
DubAPI.prototype.addToPlaylist = require(process.cwd() + '/bot/extend/addToPlaylist.js');
DubAPI.prototype.getPlaylists = require(process.cwd() + '/bot/extend/getPlaylists.js');
DubAPI.prototype.shufflePlaylist = require(process.cwd() + '/bot/extend/shufflePlaylist.js');
DubAPI.prototype.getUserQueue = require(process.cwd() + '/bot/extend/getUserQueue.js');
DubAPI.prototype.DM = require(process.cwd() + '/bot/extend/directMessages.js');

new DubAPI({ username: settings.USERNAME, password: settings.PASSWORD }, function(err, bot) {
        
    if (err) {
        console.error(err);
        process.exit(1); // exit so pm2 can restart
        return;
    }
    
    bot.myconfig = config;
    bot.maxChatMessageSplits = 5;
    bot.commandedToDJ = false;
    bot.isDJing = false;
    bot.isConnected = false;

    if (bot.myconfig.muted) {
      bot.sendChat = function(x){ console.log('muted:', x); };
    }

    if (bot.myconfig.verboseLogging) {
      bot.log = require('jethro');
      bot.log.setTimestampFormat(null,'YYYY-MM-DD HH:mm:ss:SSS');
    } else {
      bot.log = function(){return;}; // do nothing
    }

    bot.log('info', 'BOT', `Running ${config.botName} with DubAPI v${bot.version}`);

    function connect() {
        bot.connect(settings.ROOMNAME);
    }

    /**
     * Exit/Error related events
     */
    let closing = false;
    function onExit(err) {
        if (closing) {
          return;
        }
        
        if (err) bot.log('error', 'BOT', err.stack);

        closing = true;
        if (bot.isConnected) {
          bot.sendChat("I'm ded :skull:");
          bot.on('disconnected', function(data) {
            process.exit(1);
          });
          bot.disconnect();
        } else {
          process.exit(1);
        }
    }

    //Properly disconnect from room and close db connection when program stops
    process.on('exit', onExit); //automatic close
    process.on('SIGINT', onExit); //ctrl+c close
    process.on('uncaughtException', onExit);
    process.on('message', function(msg) {  
      bot.log('info','BOT', 'message: ' + msg);
      if (msg === 'shutdown') {
        onExit();
      }
    });

    bot.on('error', function(err) {
      bot.log('error', 'BOT', 'bot.on[error]: ' + err);
    });

    connect();

    //pass the bot and db to the events handler
    require('./events')(bot, db);
});