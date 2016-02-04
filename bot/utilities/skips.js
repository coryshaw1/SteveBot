module.exports.broken = function(bot, db, data) {
	var dj = bot.getDJ();

	bot.moderateSkip(function(){
		bot.sendChat("Sorry @" + dj.username + " this song/video is either broken or unavailable for all the users' countries in our room!");
	});
};

module.exports.nsfw = function(bot, db, data) {
	var dj = bot.getDJ();

	bot.moderateSkip(function(){
		bot.sendChat("Sorry @" + dj.username + " this song/video has been flagged as NSFW!");
	});
};

module.exports.op = function(bot, db, data) {
	var dj = bot.getDJ();

	bot.moderateSkip(function(){

		bot.sendChat("Sorry @" + dj.username + " this song is overplayed!");

		//Wait for next dj in line to start
		setTimeout(function(){
			var backInQueue = bot.getQueuePosition(dj.id) != -1;

			if(backInQueue) {
				bot.moderateMoveDJ(dj.id, 0, function() {
					bot.sendChat("@" + dj.username + ", I've moved you back up to the front of the queue. Please be more selective with your tracks :thumbsup:");
				});
			}
		}, 2000);
	});
};

module.exports.theme = function(bot, db, data) {
	var dj = bot.getDJ();

	bot.moderateSkip(function(){
		bot.sendChat("Sorry @" + dj.username + " this song/video does not match the room's theme!");
	});
};

module.exports.troll = function(bot, db, data) {
	var dj = bot.getDJ();

	bot.moderateSkip(function(){
		bot.sendChat("Nice troll @" + dj.username + "... :v:");
		bot.moderateKickUser(bot.id, "Trolling", function(){
			bot.sendChat("Everyone say bye @" + dj.username + "! :v:");
		});
	});
};