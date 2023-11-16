"use strict";

/**
 * @param {DubAPI} bot
 */
module.exports = async function (bot) {
  try {
    const res = await fetch("https://cataas.com/cat?json=true");
    if (!res.ok) {
      // default to trying giphy
      bot.sendChat("!giphy cat");
    } else {
      const json = await res.json();
      if (json?._id) bot.sendChat(`https://cataas.com/cat/${json._id}.jpeg`);
    }
  } catch (error) {
    bot.log("error", "BOT", `[!cat] ${error}`);
    bot.sendChat("Bad request to cats...");
  }
};
