process.stdin.resume();

var DubAPI = require('dubapi');
var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var _ = require('underscore');
var repo = require('./repo.js');
var settings = require('./settings.js').settings;

var lastMediaFKID = '';
var currentLink = '';
var currentName = '';
var currentID = '';
var currentType = '';
var currentDJName = '';
var currentUpdubs = 0;
var currentDowndubs = 0;
var raffle = null;
var raffleStarted = false;
var lockedNumberOne = false;

var usersThatPropped = [];
var usersThatHearted = [];
var usersInRaffle = [];

new DubAPI({username: settings.USERNAME, password: settings.PASSWORD}, function(err, bot) {
    if (err) return console.error(err);

    MongoClient.connect(settings.MONGODBURL, function(errDb, db) {
    
        console.log('Running SteveBot with DubAPI v' + bot.version);

        function connect() {bot.connect(settings.ROOMNAME);}

        function disconnect(err) {
            db.close();
            bot.disconnect();

            if(err) console.log(err.stack);

            process.exit();
        }

        process.on('exit', disconnect); //automatic close
        process.on('SIGINT', disconnect); //ctrl+c close
        process.on('uncaughtException', disconnect)

        bot.on('connected', function(name) {
            console.log('Connected to ' + name);
            
            setTimeout(function(){
                var users = bot.getUsers();

                for(var i = 0; i < users.length; i++) {
                    repo.logUser(db, users[i], function(data){});
                }

                bot.updub();

                var media = bot.getMedia();
                var dj = bot.getDJ();

                if(media){
                    currentName = media.name;
                    currentID = media.fkid;
                    currentType = media.type;
                    currentDJName = (dj == undefined ? "404usernamenotfound" : (dj.username == undefined ? "404usernamenotfound" : dj.username));
                }

                //start another raffle in 15-45 min
                setTimeout(startRaffle, Math.floor(Math.random() * (1000*60*45)) + (1000*60*15));
            }, 5000);
        });

        bot.on('disconnected', function(name) {
            console.log('Disconnected from ' + name);

            setTimeout(connect, 15000);
        });

        bot.on('error', function(err) {
            console.error(err);
        });

        bot.on(bot.events.roomPlaylistUpdate, function(data){
            //print out last song info with dub counts

            bot.updub();
            getLink(function(link){
                currentLink = link;
            });
            lastMediaFKID = currentID;

            if(!data.media) return;

            currentName = data.media.name;
            currentID = data.media.fkid;
            currentType = data.media.type;
            currentDJName = (data.user == undefined ? "404usernamenotfound" : (data.user.username == undefined ? "404usernamenotfound" : data.user.username));
        });

        bot.on(bot.events.userJoin, function(data){
          repo.logUser(db, data.user, function(user){
            console.log('[JOIN]', '[', user.username, '|', user.id, '|', user.dubs, '|', user.logType, ']');
            setTimeout(function(){
                if(user.logType === 'inserted') {
                    bot.sendChat('Welcome to Friday Fuel , @' + user.username + '! :wave:');
                }
                else {
                    bot.sendChat('Welcome back to Friday Fuel , @' + user.username + '! :wave:');
                }
            }, 2500);
          });
        });

        bot.on(bot.events.userLeave, function(data){
          console.log('[LEAVE]', '[', data.user.username, '|', data.user.id, '|', data.user.dubs, ']');
        });
        
        bot.on(bot.events.roomPlaylistUpdate, function(data){
            usersThatPropped = [];
            usersThatHearted = [];
        });

        bot.on(bot.events.chatMessage, function(data) {
            console.log(data.user.username + ': ' + data.message);
            switch(data.message.trim(' ').toLowerCase()) {
                case '!dubx':
                    bot.sendChat('Check out the DubX plugin at http://dubx.net for autodubs, emotes, and more!');
                    break;
                case '!steve':
                    bot.sendChat('All hail the one true Steve!');
                    bot.sendChat('http://i.imgur.com/zQrmXJa.gif');
                    break;
                case '!ping':
                    bot.sendChat('Pong!');
                    break;
                case '!pong':
                    bot.sendChat('Ping!');
                    break;
                case '!thanks':
                    bot.sendChat('You\'re welcome!');
                    break;
                case '!props':
                case '!tune':
                case '!love':
                case '!heart':
                    if(!bot.getDJ())
                        return bot.sendChat('There is no DJ playing!');

                    if(data.user.username !== bot.getDJ().username){
                        if(data.message.trim(' ') === '!props' || data.message.trim(' ') === '!tune'){
                            if(_.contains(usersThatPropped, data.user.id))
                                return bot.sendChat('@' + data.user.username + ', you have already given props for this song!');

                            repo.propsUser(db, bot.getDJ(), function(user){
                                usersThatPropped.push(data.user.id);
                                bot.sendChat('Keep up the good work @' + bot.getDJ().username + '! @' + data.user.username + ' likes your song! ' +
                                    'You now have ' + user.props + ' props! :punch: ');
                            });
                        }
                        else{
                            if(_.contains(usersThatHearted, data.user.id))
                                return bot.sendChat('@' + data.user.username + ', you have already given a heart for this song!');

                            repo.heartsUser(db, bot.getDJ(), function(user){
                                usersThatHearted.push(data.user.id);
                                bot.sendChat('Keep up the good work @' + bot.getDJ().username + '! @' + data.user.username + ' likes your song! ' +
                                    'You now have ' + user.hearts + ' hearts! :heart: ');
                            });
                        }
                    }
                    else{
                        bot.sendChat('Wow @' + data.user.username + ' ... Love yourself in private weirdo... :confounded:');
                    }
                    break;
                case '!balance':
                    repo.findUserById(db, data.user.id, function(user){
                        if(!user.hearts)
                            user.hearts = 0;
                        if(!user.props)
                            user.props = 0;
                        bot.sendChat('@' + user.username + ' you have ' + user.hearts + ' heart' + (user.hearts == 1 ? '' : 's')  + 
                            ' :heart: and ' + user.props + ' props :punch:!');
                    });
                    break;
                case '!myhearts':
                    repo.findUserById(db, data.user.id, function(user){
                        if(!user.hearts)
                            user.hearts = 0;
                        bot.sendChat('@' + user.username + ' you have ' + user.hearts + ' heart' + (user.hearts == 1 ? '' : 's')  + ' :heart:!');
                    });
                    break;
                case '!myprops':
                    repo.findUserById(db, data.user.id, function(user){
                        if(!user.props)
                            user.props = 0;
                        bot.sendChat('@' + user.username + ' you have ' + user.props + ' props :punch:!');
                    });
                    break;
                case '!meh':
                case '!boo':
                    if(data.user.username !== bot.getDJ().username){
                        bot.sendChat('Uh oh @' + bot.getDJ().username + ' ... @' + data.user.username + ' doesn\'t like your song! :broken_heart: ');
                    }
                    else{
                        bot.sendChat('Don\'t hate yourself, @' + data.user.username + ' ... We still love you... :heart:');
                    }
                    break;
                case '!eta':
                    eta(data.user.id, data.user.username);
                    break;
                case '!lunch':
                    bot.sendChat(':bell: DING DING DING! Lunch bell!!! :bell:');
                    bot.sendChat('Everyone remember to pause your \'My Queue\' so you don\'t play songs while you\'re away!');
                    break;
                case '!link':
                case '!song':
                    if(!currentLink)
                    {
                        bot.sendChat("No song is playing at this time!");
                    }
                    else{
                        bot.sendChat("@" + data.user.username + " The current song is '" + currentName + "', and the link is " + currentLink);
                    }
                    break;
                case '!raffle':
                    if(data.user.username !== 'mbsurfer'){
                        return bot.moderateDeleteChat(data.id, function(response){
                            console.log('Nice try @' + data.user.username + ' :sunglasses:');
                        });
                    }

                    if(!raffleStarted)
                        startRaffle();
                    break;
                case '!join':
                    if(!raffleStarted) return bot.sendChat('There isn\'t a raffle at this time!');

                    if(usersInRaffle.some(function(v) { return data.user.id.indexOf(v.id) >= 0; })) {
                        return bot.sendChat("@" + data.user.username + " you've already entered the raffle!");
                    }

                    if(!bot.getQueue().some(function(v) { return data.user.id.indexOf(v.uid) >= 0; })) {
                        return bot.sendChat("@" + data.user.username + " you must be in the queue to enter the raffle!");
                    }

                    var something = bot.moderateDeleteChat(data.id, function(response){
                        if(bot.getQueuePosition(data.user.id) == 0) {
                            lockedNumberOne = data.user.username;
                            bot.sendChat("@" + data.user.username + " locked in their position at #1!");
                        }
                        else {
                            usersInRaffle.push({'id': data.user.id, 'username': data.user.username});
                            console.log('Added ' + data.user.username + ' to the raffle');
                        }
                    });
                    break;
                case '!bot':
                    bot.sendChat("I'm still here!");
                    break;
                case '!country':
                case '!rules':
                    bot.sendChat("Playing country will get you banned!");
                    break;
                case '!leaders':
                    repo.propsLeaders(db, function(props){
                        var propsChat = 'By !props :fist: : ';
                        for(var i = 0; i < props.length; i++){
                            propsChat += '@' + props[i].username + ' (' + props[i].props + ')';

                            if(i !== (props.length - 1))
                                propsChat += ', ';
                        }
                        bot.sendChat(propsChat);

                        repo.heartsLeaders(db, function(hearts){
                            var heartsChat = 'By !heart :heart: : ';
                            for(var i = 0; i < hearts.length; i++){
                                heartsChat += '@' + hearts[i].username + ' (' + hearts[i].hearts + ')';
                                
                                if(i !== (hearts.length - 1))
                                    heartsChat += ', ';
                            }
                            bot.sendChat(heartsChat);
                        });
                    });
                    break;
                case '!score':
                    console.log(bot.getScore());
                    bot.sendChat(bot.getScore());
                    break;
                case '!boathousebetty':
                case '!betty':
                    bot.sendChat("http://i.imgur.com/LFL6cPP.png");
                    break;
                case '!bettywap':
                    bot.sendChat("http://i.imgur.com/iZGFilI.jpg");
                    break;
                case '!missuniverse':
                    bot.sendChat('And the winner of Miss Universe is...');
                    setTimeout(function(){
                        bot.sendChat('Miss Colombia!!!');
                        setTimeout(function(){
                            bot.sendChat('Haha just kidding, it\'s Miss Steve Harvey');
                            bot.sendChat('It\'s on the card here, see');
                        }, 5000);
                    }, 3000);
                    break;
                default:
                    break;
            }
        });

        function startRaffle() {
            raffleStarted = true;
                    
            bot.sendChat(":loudspeaker: STARTING A RAFFLE! want to be moved closer to the dj booth? type :point_right: " +
                "!join :point_left: and you might just get lucky! :clock7: you've got 30 seconds!");

            if(raffle) clearTimeout(raffle); //don't have multiple raffle timeouts running at once

            raffle = setTimeout(function() {
                var numberEntered = usersInRaffle.length + (lockedNumberOne ? 1 : 0);
                bot.sendChat(":clock7: The raffle expires in 10 seconds, " + numberEntered + " user" 
                    + (numberEntered == 1 ? " is" : "s are") + " participating! Hurry @djs and :point_right: !join :point_left:");
            
                setTimeout(function() {
                    //start another raffle in 15-45 min
                    setTimeout(startRaffle, Math.floor(Math.random() * (1000*60*45)) + (1000*60*15));

                    var min = 0;
                    var numberEntered = usersInRaffle.length + (lockedNumberOne ? 1 : 0);
                    if(numberEntered == 0) {
                        bot.sendChat('No one entered the raffle! Be sure to pay attention for the next one!');
                        usersInRaffle = [];
                        raffleStarted = false;
                        lockedNumberOne = false;
                        return;
                    }
                    else if(numberEntered == 1 && lockedNumberOne) {
                        bot.sendChat(':trophy: The raffle ended and only the next DJ, @' + lockedNumberOne + ', participated; therefore, the queue stays the same!');
                        usersInRaffle = [];
                        raffleStarted = false;
                        lockedNumberOne = false;
                        return;
                    }

                    var randomWinner = usersInRaffle[Math.floor(Math.random() * (usersInRaffle.length - min)) + min];

                    if(bot.getQueuePosition(randomWinner.id) > 0) {
                        bot.moderateMoveDJ(randomWinner.id, !lockedNumberOne ? 0 : 1, function(response){});
                    }

                    if(numberEntered == 1) {
                        bot.sendChat(':trophy: The raffle has ended! 1 user participated and our lucky winner is: @' + randomWinner.username + '!');
                    }
                    else {
                        bot.sendChat(':trophy: The raffle has ended! ' + numberEntered + ' users participated and our lucky winner is: @' + randomWinner.username + '!');
                    }

                    usersInRaffle = [];
                    raffleStarted = false;
                    lockedNumberOne = false;
                }, 10000);
            }, 20000);
        }

        function eta(uid, username){
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
        }

        function getLink(callback) {
            var media = bot.getMedia();

            if(!media) return callback();

            if(media.type === 'soundcloud') {
                var options = {
                    url: 'https://api.soundcloud.com/tracks/' + media.fkid + '.json?client_id=' + settings.SOUNDCLOUDID
                };

                var responseBack = function(error, response, body) {
                    if(!error){
                        var body = JSON.parse(body);
                        return callback(body.permalink_url);
                    }
                    else {
                        console.log("Soundcloud Error: " + error);
                        return callback('Error... http://google.com');
                    }
                }

                request(options, responseBack);
            }
            else {
                return callback('http://www.youtube.com/watch?v=' + media.fkid);
            }
        }

        connect();

    });
});