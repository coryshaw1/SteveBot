/**
 * !leaders
 * returns the top 3 props and flow leaders
 */
'use strict';
const leaderUtils = require(process.cwd() + '/bot/utilities/leaderUtils.js');
const moment = require('moment');

module.exports = function(bot, data) {
  if (!bot.leaderboard) {
    bot.sendChat("I don't have leader informtaion at the momemt but try again in a minute");
  }

  var year = moment().format('Y');
  var month = moment().format('MMM');

  bot.sendChat('By !props, :heart:, :musical_note:, :fist:, :fire:, etc...');
  bot.sendChat(bot.leaderboard[ month + year ].props);
  

  bot.sendChat('By *!flowpoint* :surfer:');
  bot.sendChat(bot.leaderboard[ month + year ].flow);

};

