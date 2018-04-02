/**
 * !leaders
 * returns the top 3 props and flow leaders
 */
'use strict';
const leaderUtils = require(process.cwd() + '/bot/utilities/leaderUtils.js');
const moment = require('moment');

module.exports = function(bot, db, data) {
  if (!bot.leaderboard) {
    bot.sendChat("I don't have leader informtaion at the momemt but try again in a minute");
    return;
  }

  if (data && data.params && data.params[0] && data.params[0] === "all") {
    var all_time = leaderUtils.allTimeLeaders(bot);

    var propString = all_time.props.reduce(function(a,v){
      return a += `${v[0]} (${v[1]}), `;
    }, '').replace(/, $/, '');

    var flowString = all_time.flows.reduce(function(a,v){
      return a += `${v[0]} (${v[1]}), `;
    }, '').replace(/, $/, '');

    bot.sendChat(`All time prop leaders are:`);
    bot.sendChat(propString);
    bot.sendChat(`All time flow leaders are:`);
    bot.sendChat(flowString);
    return;
  }

  var year = moment().format('Y');
  var month = moment().format('MMM');
  var month_full = moment().format('MMMM');

  bot.sendChat( `Current leaders for ${month_full} ${year} are:` );

  let current_board = bot.leaderboard[ month + year ];

  if (!current_board) {
    return bot.sendChat(`Error accessing data for ${month_full} ${year}`);
  }

  let info = `By *props* :heart: :musical_note: :fist: :fire: etc...
    ${current_board.props}
    By *flow* :surfer:
    ${ current_board.flow }
    points will reset at the end of every month
  `;
  bot.sendChat(info);
};

