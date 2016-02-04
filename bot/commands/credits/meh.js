var repo = require(process.cwd()+'/repo');

module.exports = function(bot, db, data) {
	if(data.user.username !== bot.getDJ().username){
        bot.sendChat('Uh oh @' + bot.getDJ().username + ' ... @' + data.user.username + ' doesn\'t like your song! :broken_heart: ');
    }
    else{
        bot.sendChat('Don\'t hate yourself, @' + data.user.username + ' ... We still love you... :heart:');
    }
};