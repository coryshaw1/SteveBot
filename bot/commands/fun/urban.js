"use strict";
const API_URL = "http://api.urbandictionary.com/v0/";

/**
 * @param {DubAPI} bot
 * @param {object} json
 */
function showResult(bot, json) {
  if (!bot) {
    return;
  }

  if (!json || !json.list || json.list.length === 0) {
    return bot.sendChat("Sorry no results for that");
  }

  var first = json.list[0];

  let def = first.definition;
  let word = first.word;
  let link = first.permalink;

  bot.sendChat(`*${word}* - ${def} ${link}`);
}

/**
 *
 * @param {string} path
 * @param {DubAPI} bot
 */
function getFirstResult(path, bot) {
  fetch(API_URL + path)
    .then((res) => {
      if (res.ok) return res.json();
      else throw new Error(res.status.toString());
    })
    .then((json) => showResult(bot, json))
    .catch((error) => {
      bot.log("error", "BOT", `[!urban] ${error}`);
      bot.sendChat("Something happened connecting with urban dictionairy");
    });
}

/**
 * @param {DubAPI} bot
 */
module.exports = function (bot, db, data) {
  if (!bot || !data) {
    return;
  }

  if (data.params.length === 0) {
    getFirstResult("random", bot);
    return;
  }

  var search = encodeURI(data.params.join(" ").trim());
  getFirstResult("define?term=" + search, bot);
};
