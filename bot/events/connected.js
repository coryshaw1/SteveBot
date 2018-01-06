'use strict';
const mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
const historyStore = require(process.cwd()+ '/bot/store/history.js');
const triggerStore = require(process.cwd()+ '/bot/store/triggerStore.js');
const dmStore = require(process.cwd()+ '/bot/store/messages.js');
const leaderUtils = require(process.cwd() + '/bot/utilities/leaderUtils.js');
const settings = require(process.cwd() + '/private/settings.js');
const repo = require(process.cwd()+'/repo');

module.exports = function(bot, db) {
  bot.on('connected', function(data) {
    bot.isConnected = true;
    bot.log('info', 'BOT', 'Connected to ' + data);
    bot.sendChat("`Initializing...`");
    var initStart = Date.now();

    setTimeout(function(){
      // log current logged in user data
      var users = bot.getUsers();
      for(var i = 0; i < users.length; i++) {
        repo.logUser(db, users[i]);
      }

      // handle current playing song
      bot.updub();
      var media = bot.getMedia();
      var dj = bot.getDJ();
      if(media) {
        var currentSong = {
          name : media.name,
          id : media.fkid,
          type : media.type,
          dj : !dj || !dj.username ? '404usernamenotfound' : dj.username
        };
        mediaStore.setCurrent(currentSong);
      }

      dmStore.init(bot);

      historyStore.init(bot);

      // store user info locally
      var user = db.ref('users');
      user.on('value', function(snapshot){
          var val = snapshot.val();
          bot.allUsers = val;
          // update leaderboard everytime someone gives a point
          leaderUtils.updateLeaderboard(bot, db);
        }, function(error){
          bot.log('error', 'BOT', `error getting users from firebase - ${error}`);
      });

      // store trigger info locally
      triggerStore.init(bot,db);

      // store leaderboard info locally
      var leaderboard = db.ref('leaderboard');
      leaderboard.on('value', function(snapshot){
          var val = snapshot.val();
          bot.leaderboard = val;
        }, function(error){
          bot.log('error', 'BOT', `error getting leaderboard from firebase - ${error}`);
      });

      var complete = (Date.now() - initStart)/1000;
      bot.sendChat(`\`Initialization completed in ${complete} seconds\``);
      
    }, 3000);
  });
};