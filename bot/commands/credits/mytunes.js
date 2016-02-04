var repo = require(process.cwd()+'/repo');

module.exports = function(bot, db, data) {
	if(!data) return;

	repo.findUserById(db, data.user.id, function(user){
        if(!user.props)
            user.props = 0;
        bot.sendChat('@' + user.username + ' you have ' + user.props + ' tunes :musical_notes:!');
    });
};