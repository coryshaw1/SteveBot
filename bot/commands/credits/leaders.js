var repo = require(process.cwd()+'/repo');

module.exports = function(bot, db, data) {
	repo.propsLeaders(db, function(props){
        var propsChat = 'By !tune :musical_note: : ';
        for(var i = 0; i < props.length; i++){
            propsChat += '@' + props[i].username + ' (' + props[i].props + ')';

            if(i !== (props.length - 1))
                propsChat += ', ';
        }
        bot.sendChat(propsChat);

        repo.heartsLeaders(db, function(hearts){
            var heartsChat = 'By !love :heart: : ';
            for(var i = 0; i < hearts.length; i++){
                heartsChat += '@' + hearts[i].username + ' (' + hearts[i].hearts + ')';
                
                if(i !== (hearts.length - 1))
                    heartsChat += ', ';
            }
            bot.sendChat(heartsChat);
        });
    });
};