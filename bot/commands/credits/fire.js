var repo = require(process.cwd()+'/repo');
var usersInfo = require(process.cwd()+'/bot/utilities/users');
var _ = require('underscore');

module.exports = function(bot, db, data) {
	if(!bot.getDJ())
        return bot.sendChat('There is no DJ playing!');

    if(data.params.length > 0){
        if(_.contains(usersInfo.usersThatPropped, data.user.id))
            return bot.sendChat('@' + data.user.username + ', you have already given a flame for this song!');
        
        if (data.params.length === 1) {
            if (data.params[0].substr(0, 1) === "@" && data.params[0] !== "@"+data.user.username) {
                var recipient = bot.getUserByName(data.params[0].replace("@", ""), true);
                repo.propsUser(db, recipient, function(user){
                    usersInfo.usersThatPropped.push(data.user.id);
                    bot.sendChat('Yoooo keep up the good work @' + recipient.username + '! @' + data.user.username + ' thinks your song is :fire: :fire: :fire:! ' +
                        'You now have ' + user.props + ' flames! :fire: ');
                });
            }
            else if(data.params[0].substr(0, 1) === "@" && data.params[0] === "@" + data.user.username){
                 bot.sendChat('Wow @' + data.user.username + ' ... Love yourself in private weirdo... :confounded:');
            } 
            else {
                bot.sendChat("@" + data.user.username + " you need to @[username] to give a flame to someone");
            }
        } else {
            bot.sendChat("@" + data.user.username + " you can give fire to one person");
        }
    }
    else if(data.user.username !== bot.getDJ().username){
        if(_.contains(usersInfo.usersThatPropped, data.user.id))
            return bot.sendChat('@' + data.user.username + ', you have already given a flame for this song!');

        repo.propsUser(db, bot.getDJ(), function(user){
            usersInfo.usersThatPropped.push(data.user.id);
            bot.sendChat('Yoooo keep up the good work @' + bot.getDJ().username + '! @' + data.user.username + ' thinks your song is :fire: :fire: :fire:! ' +
                'You now have ' + user.props + ' flames! :fire: ');
        });
    }
    else{
        bot.sendChat('Wow @' + data.user.username + ' ... Love yourself in private weirdo... :confounded:');
    }
    
};