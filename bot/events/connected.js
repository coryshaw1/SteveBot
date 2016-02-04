var mediaInfo = require(process.cwd()+'/bot/utilities/media');
var repo = require(process.cwd()+'/repo');
var raffleService = require(process.cwd()+'/bot/utilities/raffle');

module.exports = function(bot, db) {
    bot.on("connected", function(data) {
        bot.log("info", "BOT", 'Connected to ' + data);
            
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
                mediaInfo.currentDJName = (dj == undefined ? "404usernamenotfound" : (dj.username == undefined ? "404usernamenotfound" : dj.username));
            }

            //start another raffle in 15-45 min
            setTimeout(function(){raffleService.startRaffle(bot)}, (Math.floor(Math.random() * (1000*60*45)) + (1000*60*15)));
        }, 5000);
    });
};