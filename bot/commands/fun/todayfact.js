"use strict";

/**
 * @param {DubAPI} bot
 */
module.exports = function (bot) {
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const factApi = `http://numbersapi.com/${month}/${day}`;

  fetch(factApi)
    .then((res) => {
      if (res.ok) return res.text();
      else throw new Error(res.status.toString());
    })
    .then((text) => bot.sendChat(text))
    .catch((err) => {
      bot.log("error", "BOT", `[!fact] ${err.message}`);
      bot.sendChat("Bad request to facts...");
    });
};
