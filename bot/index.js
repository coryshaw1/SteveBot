var DubAPI = require("dubapi"),
    log = require("jethro"),
    firebase = require("firebase"),
    pkg = require(process.cwd() + "/package.json"),
    repo = require(process.cwd() + '/repo.js'),
    settings = require(process.cwd() + '/private/settings.js');

//make logger timestamp more readable
log.setTimeformat("YYYY-MM-DD HH:mm:ss:SSS");

firebase.initializeApp({
  serviceAccount: process.cwd() + "/private/serviceAccountCredentials.json",
  databaseURL: settings.FIREBASE.BASEURL
});

var db = firebase.database();


new DubAPI({ username: settings.USERNAME, password: settings.PASSWORD }, function(err, bot) {
        
    if (err) {
        return log("error", "BOT", err);
    }

    //to find out how to use jethro visit: https://github.com/JethroLogger/Jethro
    bot.log = require("jethro");
    bot.log.setTimeformat("YYYY-MM-DD HH:mm:ss:SSS");

    bot.log("info", "BOT", 'Running DerpyBot with DubAPI v' + bot.version);

    function connect() {
        bot.connect(settings.ROOMNAME);
    }

    function disconnect(err) {
        bot.disconnect();

        if(err) bot.log("error", "BOT", err.stack);

        process.exit();
    }

    //Properly disconnect from room and close db connection when program stops
    process.on('exit', disconnect); //automatic close
    process.on('SIGINT', disconnect); //ctrl+c close
    process.on('uncaughtException', disconnect);

    bot.on("error", function(err) {
        bot.log("error", "BOT", err);
    });

    connect();

    //pass the bot and db to the events handler
    require("./events")(bot, db);
});