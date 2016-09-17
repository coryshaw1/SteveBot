var pkg = require(process.cwd() + "/package.json");

module.exports = function(bot, db) {
    bot.sendChat("DerpyBot version: " + pkg.version);
};

module.exports.extraCommands = ["v", "ver"];