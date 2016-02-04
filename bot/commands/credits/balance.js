var repo = require(process.cwd()+'/repo');

module.exports = function(bot, db, data) {

	var userIdToLookUp = data.user.id;

	if (typeof(data.params) !== "undefined" && data.params.length > 0) {
        if (data.params.length === 1) {
            if (data.params[0].substr(0, 1) === "@") {
            	if(data.params[0] == "@" + data.user.username) {
					repo.findUserById(db, data.user.id, function(user){
				        if(!user.hearts)
				            user.hearts = 0;
				        if(!user.props)
				            user.props = 0;
				        bot.sendChat('@' + user.username + ' you have ' + user.hearts + ' heart' + (user.hearts == 1 ? '' : 's')  + 
				            ' :heart: and ' + user.props + ' tunes :musical_note:!');
				    });
            	}
            	else{
	            	var recipient = bot.getUserByName(data.params[0].replace("@", ""), true);

	                if(!recipient){
						bot.sendChat('@' + user.username + ', the user ' + data.params[0] + ' was not found!');
	                } else {
						repo.findUserById(db, recipient.id, function(user){
					        if(!user.hearts)
					            user.hearts = 0;
					        if(!user.props)
					            user.props = 0;
					        bot.sendChat('@' + data.user.username + ', the user @' + user.username + ' has ' + user.hearts + ' heart' + (user.hearts == 1 ? '' : 's')  + 
					            ' :heart: and ' + user.props + ' tunes :musical_note:!');
					    });
	                }	
            	}
            } else {
                bot.sendChat("@" + user + " you need to @[username] to lookup someone");
            }
        } else {
            bot.sendChat("@" + user + " you can only lookup one person");
        }
    } else{
    	repo.findUserById(db, data.user.id, function(user){
	        if(!user.hearts)
	            user.hearts = 0;
	        if(!user.props)
	            user.props = 0;
	        bot.sendChat('@' + user.username + ' you have ' + user.hearts + ' heart' + (user.hearts == 1 ? '' : 's')  + 
	            ' :heart: and ' + user.props + ' tunes :musical_note:!');
	    });
    }
};