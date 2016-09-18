'use strict';

var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var repo = require(process.cwd()+'/repo');
// var raffleService = require(process.cwd()+'/bot/utilities/raffle');

module.exports = function(bot, db) {
  bot.on('connected', function(data) {
    bot.log('info', 'BOT', 'Connected to ' + data);
        
    setTimeout(function(){
        var users = bot.getUsers();

        for(var i = 0; i < users.length; i++) {
            repo.logUser(db, users[i], function(data){});
        }

        bot.updub();

        var media = bot.getMedia();
        var dj = bot.getDJ();

        if(media){
            mediaInfo.currentName = media.name;
            mediaInfo.currentID = media.fkid;
            mediaInfo.currentType = media.type;
            if (dj === void(0)){
                mediaInfo.currentDJName = '404usernamenotfound';
            } else {
                mediaInfo.currentDJName = dj.username === void(0) ? '404usernamenotfound' : dj.username;
            }
        }
    }, 5000);
  });
};