var repo = require(process.cwd()+'/repo');
var usersInfo = require(process.cwd()+'/bot/utilities/users');
var _ = require('underscore');

module.exports = function(bot, db, data) {
	if(!bot.getDJ())
        return bot.sendChat('There is no DJ playing!');

    if(data.params.length > 0){
        if(_.contains(usersInfo.usersThatPropped, data.user.id))
            return bot.sendChat('@' + data.user.username + ', you have already given props for this song!');
        
        if (data.params.length === 1) {
            if (data.params[0].substr(0, 1) === "@" && data.params[0] !== "@" + data.user.username) {
                var recipient = bot.getUserByName(data.params[0].replace("@", ""), true);
                repo.propsUser(db, recipient, function(user){
                    usersInfo.usersThatPropped.push(data.user.id);
                    bot.sendChat('Keep up the good work @' + recipient.username + '! @' + data.user.username + ' likes your songs! ' +
                        'You now have ' + user.props + ' tunes! :musical_note: ');
                });
            } 
            else if(data.params[0].substr(0, 1) === "@" && data.params[0] === "@" + data.user.username){
                 bot.sendChat('Wow @' + data.user.username + ' ... Love yourself in private weirdo... :confounded:');
            } 
            else {
                bot.sendChat("@" + data.user.username + " you need to @[username] to props someone");
            }
        } else {
            bot.sendChat("@" + data.user.username + " you can give props to one person");
        }
    }
    else if(data.user.username !== bot.getDJ().username){
        if(_.contains(usersInfo.usersThatPropped, data.user.id))
            return bot.sendChat('@' + data.user.username + ', you have already given props for this song!');

        repo.propsUser(db, bot.getDJ(), function(user){
            usersInfo.usersThatPropped.push(data.user.id);
            bot.sendChat('Keep up the good work @' + bot.getDJ().username + '! @' + data.user.username + ' likes your song! ' +
                'You now have ' + user.props + ' tunes! :musical_note: ');
        });
    }
    else{
        bot.sendChat('Wow @' + data.user.username + ' ... Love yourself in private weirdo... :confounded:');
    }
    
};