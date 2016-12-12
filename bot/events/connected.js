'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var historyStore = require(process.cwd()+ '/bot/store/history.js');
var repo = require(process.cwd()+'/repo');

var _env = process.env.ENV;
if (_env === null || typeof _env === 'undefined' || _env === '') {
  _env = 'dev';
}

module.exports = function(bot, db) {
  bot.on('connected', function(data) {
    bot.log('info', 'BOT', 'Connected to ' + data);

    setTimeout(function(){
      var users = bot.getUsers();

      for(var i = 0; i < users.length; i++) {
        repo.logUser(db, users[i], function(){});
      }

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

      historyStore.init(bot);

      // store user info locally
      var user = db.ref(_env + '/users');
      user.on('value', function(snapshot){
          var val = snapshot.val();
          bot.allUsers = val;
        }, function(error){
          bot.log('error', 'BOT', 'error getting users from firebase');
      });

      // store user info locally
      var triggers = db.ref('triggers');
      triggers.on('value', function(snapshot){
          var val = snapshot.val();
          bot.allTriggers = val;
        }, function(error){
          bot.log('error', 'BOT', 'error getting triggers from firebase');
      });

    }, 5000);
  });
};