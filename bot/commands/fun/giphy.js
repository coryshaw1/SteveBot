"use strict";
const giphy = require(process.cwd() + "/bot/utilities/giphy.js");

/**
 * 
 * @param {DubAPI} bot 
 * @param {*} db 
 * @param {*} data 
 * @returns 
 */
module.exports = async function (bot, db, data) {
  bot.sendChat("Giphy is currently disabled until further notice.");
  // return;

  // I need to create a Giphy Developer account to get an API key
  // I'll do that eventually, but for now, this is disabled.

  if (!data) {
    bot.log("error", "BOT", "[GIPHY] ERROR Missing data");
    return bot.sendChat("An error occured, try again");
  }

  if (data.params.length === 0) {
    return bot.sendChat("*usage:* !giphy <search text>");
  }

  data.triggerText = data.params.join("+");

  try {
    const gifUrl = await giphy.getGif({ random: true }, data.triggerText);
    bot.sendChat(gifUrl);
  } catch (err) {
    bot.sendChat("Bad request to giphy...");
  }
};
