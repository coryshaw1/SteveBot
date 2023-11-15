"use strict";
const moment = require("moment");
const repo = require(process.cwd() + "/repo");

/**
 * Takes a flat JS Object with values that are only strings or numbers and flips
 * the keys and values.
 * For example, this: { test: "flip" }
 * will become this: { flip: "test" }
 * @param { {[key: string]: string | number }} obj
 * @returns { {[key: string]: string | number }}
 */
function flipObj(obj) {
  return Object.keys(obj).reduce((ret, key) => {
    const val = obj[key];
    if (typeof val === "string" || typeof val === "number") {
      ret[val] = key;
      return ret;
    } else {
      throw new Error(
        `Object.flip only works with values that are numbers or strings. Value type for key ${key} is a ${typeof val}`
      );
    }
  }, {});
}

// firebase forbids these special characters in object keys so creating this
// simple pairing to encode/decode them since these don't have html entities or glyphs

const CHAR_ENCODE = {
  ".": "*!period!*",
  $: "*!dollar!*",
  "[": "*!lbracket!*",
  "]": "*!rbracket!*",
  "#": "*!hash!*",
  "/": "*!forwadslash!*",
  " ": "*!space!*",
};

// swap the keys with the values
const CHAR_DECODE = flipObj(CHAR_ENCODE);

/**
 * @param {string} str
 * @returns {string}
 */
function encodeUsername(str) {
  const keys = Object.keys(CHAR_ENCODE);
  return str.split("").reduce((acc, char) => {
    if (keys.includes(char)) {
      return acc + CHAR_ENCODE[char];
    } else {
      return acc + char;
    }
  }, "");
}

/**
 * @param {string} str
 * @returns {string}
 */
function decodeUsername(str) {
  return Object.keys(CHAR_DECODE).reduce((acc, key) => {
    if (acc.includes(key)) {
      return acc.split(key).join(CHAR_DECODE[key]);
    }
    return acc;
  }, str);
}

/**
 *
 * @param {DubAPI} bot
 * @param {"props" | "flow"} prop
 * @returns
 */
function getTop3(bot, prop) {
  /**
   * @type {DubAPIUser[]}
   */
  const arr = [];
  Object.values(bot.allUsers).forEach((user) => {
    arr.push(user);
  });

  // help from: http://stackoverflow.com/a/1129270/395414
  arr.sort(function (a, b) {
    if (a[prop] < b[prop]) {
      return -1;
    }
    if (a[prop] > b[prop]) {
      return 1;
    }
    return 0;
  });
  arr.reverse();
  var finalArr = [];
  for (let i = 0; i < 3; i++) {
    finalArr.push(arr[i]);
  }
  return finalArr;
}

/**
 *
 * @param {DubAPI} bot
 * @param {object} db
 */
function updateLeaderboard(bot, db) {
  var year = moment().format("Y");
  var month = moment().format("MMM");

  /**
   * @type {{month: string, year: string, props: string, propsObj: { [key: string]: number }, flow: string, flowObj: { [key: string]: number }}}
   */
  var leaderObj = {
    month,
    year,
    props: "",
    propsObj: {},
    flow: "",
    flowObj: {},
  };

  /**
   * @type {string[]}
   */
  var propsArr = [];
  var props = getTop3(bot, "props");
  props.forEach(function (user) {
    if (user.props > 0) {
      propsArr.push(user.username + " (" + user.props + ")");
      const encodedUserName = encodeUsername(user.username);
      leaderObj.propsObj[encodedUserName] = user.props;
    }
  });
  if (propsArr.length === 0) {
    leaderObj.props = "nobody got any props";
  } else {
    leaderObj.props = propsArr.join(", ");
  }

  /**
   * @type {string[]}
   */
  var flowArr = [];
  var flow = getTop3(bot, "flow");
  flow.forEach(function (user) {
    if (user.flow > 0) {
      flowArr.push(user.username + " (" + user.flow + ")");
      const encodedUserName = encodeUsername(user.username);
      leaderObj.flowObj[encodedUserName] = user.flow;
    }
  });
  if (flowArr.length === 0) {
    leaderObj.flow = "there are currently no flow leaders";
  } else {
    leaderObj.flow = flowArr.join(", ");
  }

  repo
    .insertLeaderMonth(db, month + year, leaderObj)
    .then(function () {
      // bot.log('info', 'BOT', month + year + ': Leaderboard updated');
    })
    .catch(function (e) {
      bot.log("error", "BOT", `error updating leaderboard ${e.message}}`);
    });
}
/**
 * Work in progress
 * Update the All Time Leaders board
 *
 * @param {DubAPI} bot instance of DubAPI
 */
function allTimeLeaders(bot) {
  if (!bot.leaderboard) {
    bot.sendChat("I don't have leader informtaion at the momemt but try again in a minute");
    return;
  }

  /* 
    Leaders object structure:
      month_year
        flowObj
          user1: total
          user2: total
          user3: total
        propsObj
          user1: total
          user2: total
          user3: total
  */

  /**
   * @type {{ [key: string]: number }}
   */
  const flows = {};
  /**
   * @type {{ [key: string]: number }}
   */
  const props = {};

  // build our list of flows and props
  Object.keys(bot.leaderboard).forEach((key) => {
    let month_year = bot.leaderboard[key];

    // add up all the flows
    for (let user in month_year.flowObj) {
      const u = decodeUsername(user);
      if (!flows[u]) {
        flows[u] = month_year.flowObj[user];
      } else {
        flows[u] += month_year.flowObj[user];
      }
    }

    // add up all the props
    for (let user in month_year.propsObj) {
      const u = decodeUsername(user);
      if (!props[u]) {
        props[u] = month_year.propsObj[user];
      } else {
        props[u] += month_year.propsObj[user];
      }
    }
  });

  // sort all the flows by this method:
  // https://stackoverflow.com/a/1069840/395414

  const flow_sortable = [];
  for (let u in flows) {
    flow_sortable.push([u, flows[u]]);
  }

  const top3Flow = flow_sortable
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 3);

  // sort all the props
  const props_sortable = [];
  for (let u in props) {
    props_sortable.push([u, props[u]]);
  }

  const top3Props = props_sortable
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .reverse()
    .slice(0, 3);

  return {
    props: top3Props,
    flows: top3Flow,
  };
}

/**
 * convert string to Capitlized 3 letter month
 */
const alphaRegex = new RegExp("[^a-z]+", "ig");

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function formatMonth(str) {
  str = str.replace(alphaRegex, ""); // sanitize
  const first = str.charAt(0).toUpperCase();
  return (first + str.toLowerCase().substr(1)).replace(/([a-z]{3}).+/i, "$1");
}

/**
 * 
 * @param {DubAPI} bot 
 * @param {string} month 
 * @param {string} year 
 * @returns 
 */
function getLeadersByMonthYear(bot, month, year) {
  if (!bot.leaderboard) {
    bot.sendChat("I don't have leader informtaion at the momemt but try again in a minute");
    return;
  }

  if (!/^\d{4}$/.test(year)) {
    bot.sendChat(`Month or year was formatted wrong.`);
    bot.sendChat(`Please use \`!leaders <Month> <4-digit-year>\``);
    return;
  }

  const key = formatMonth(month) + year;
  const info = bot.leaderboard[key];
  if (!info) {
    bot.sendChat(`Sorry no info exists for ${month} ${year}`);
    return;
  }

  return info;
}

module.exports = {
  getTop3: getTop3,
  updateLeaderboard: updateLeaderboard,
  allTimeLeaders: allTimeLeaders,
  getLeadersByMonthYear: getLeadersByMonthYear,
};
