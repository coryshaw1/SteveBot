module.exports = function(bot, db, data) {
    var uid = data.user.id;
	var username = data.user.username;
    var queue = bot.getQueue();
    var booth_time = 0;
    var in_queue = false;

    for(var i = 0; i < queue.length; i++){
        if(queue[i].uid != uid){
            booth_time += queue[i].media.songLength / 1000 / 60;
        }
        else{
            in_queue = true;
            break;
        }
    }

    if(!in_queue){
        return bot.sendChat('@' + username + ', you\'re not currently in the queue!');
    }
    else{
        if(Math.round(booth_time) === 0)
            return bot.sendChat('@' + username + ', your song will play at the end of this song!');

        return bot.sendChat('@' + username + ', your song will play in about ' + Math.round(booth_time) + ' minutes!');
    }
};
