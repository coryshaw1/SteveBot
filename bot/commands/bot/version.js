var pkg = require(process.cwd() + "/package.json");

module.exports = function(bot, db) {
    bot.sendChat("SteveBot version: " + pkg.version);
};
