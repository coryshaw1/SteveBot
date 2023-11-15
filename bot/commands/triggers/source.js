"use strict";
var repo = require(process.cwd() + "/repo");
const moment = require("moment");

/**
 *
 * @param {DubAPI} bot  dubapi instance
 * @param {import('firebase-admin').database} db   Firebase instance
 * @param {object} data Room info object
 * @param {boolean} isBrad
 */
module.exports = function (bot, db, data, isBrad = false) {
  if (data.params === void 0 || data.params.length < 1) {
    return bot.sendChat("*usage:* !source <trigger_name>");
  }

  if (data.params.length > 1) {
    bot.sendChat("only one trigger at a time");
    return bot.sendChat("*usage:* !source <trigger_name>");
  }

  var trigger = data.params[0];

  if (trigger.charAt(0) === "!") {
    trigger = trigger.substring(1);
  }

  repo.getTrigger(bot, db, trigger, function (val) {
    if (val !== null) {
      var keys = Object.keys(val);
      var result = val[keys[0]];
      var theAuthor = result.Author || "unknown";
      let extendedInfo = false;
      let chatMsg = `the trigger ${trigger}`;
      let chatMsgEnd = ` was created/updated by ${theAuthor}`;

      if (isBrad) {
        if (theAuthor.toLowerCase() === "brad") {
          return bot.sendChat("Yes");
        }
        return bot.sendChat(`No, it was ${theAuthor}`);
      }

      if (result.createdOn && result.createdBy) {
        let when = moment(result.createdOn).format("MMM Do YYYY");
        chatMsg += ` was created by ${result.createdBy} on ${when}`;
        extendedInfo = true;
      }

      if (result.lastUpdated && result.status && result.status === "updated") {
        let when = moment(result.lastUpdated).format("MMM Do YYYY");
        chatMsg += ` and was last updated by ${theAuthor} on ${when}`;
        extendedInfo = true;
      }

      if (extendedInfo) {
        return bot.sendChat(chatMsg);
      } else {
        return bot.sendChat(chatMsg + chatMsgEnd);
      }
    }
  });
};
