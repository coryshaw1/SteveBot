var DubAPI = require("dubapi"),
    log = require("jethro"),
    MongoClient = require('mongodb').MongoClient,
    pkg = require(process.cwd() + "/package.json"),
    repo = require(process.cwd() + '/repo.js'),
    settings = require(process.cwd() + '/settings.js').settings;

//make logger timestamp more readable
log.setTimeformat("YYYY-MM-DD HH:mm:ss:SSS");

new DubAPI({ username: settings.USERNAME, password: settings.PASSWORD }, function(err, bot) {
        
    //to find out how to use jethro visit: https://github.com/JethroLogger/Jethro
    bot.log = require("jethro");
    bot.log.setTimeformat("YYYY-MM-DD HH:mm:ss:SSS");

    bot.log("info", "BOT", 'Running SteveBot with DubAPI v' + bot.version);

    if (err) {
        return log("error", "BOT", err);
    }

    //connect to db
    MongoClient.connect(settings.MONGODBURL, function(errDb, db) {

        function connect() {
            bot.connect(settings.ROOMNAME);
        }

        function disconnect(err) {
            db.close();
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
});