'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var historyStore = require(process.cwd()+ '/bot/store/history.js');
var repo = require(process.cwd()+'/repo');

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
  }, 5000);
  });
};