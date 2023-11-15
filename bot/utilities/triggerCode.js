const _get = require("lodash/get");

/**
 * Mini programming language for triggers
 * usage:
 *
 * Single Command per line
 * { ACTION jsonPath using lodash.get syntax FROM source }
 * '{ GET obj[0].name FROM http://blabla.com/{0} }'
 */

/* 
  example:
  
  create trigger like this:
  !trigger wiki {GET [3][0] FROM https://en.wikipedia.org/w/api.php?action=opensearch&search={0}&limit=1&namespace=0&format=json}

  then use it like this:
  !wiki black+cats
 */

/**
 *
 * @param {string} trig
 * @returns
 */
function parseTrigger(trig) {
  // remove open/close brackets
  const nodes = trig.slice(1, -1).trim().split(" ");

  /**
   * For now this is super super simple and only handles GET
   * requests from a url and that's it.
   * nodes[0] should always always === "GET"
   * nodes[2] should always always === "FROM"
   * so we can ignore them.. for now.
   */

  return {
    jsonPath: nodes[1],
    url: nodes[3],
  };
}

/**
 *
 * @param {DubAPI} bot
 * @param {string} trigger
 * @param {object} data
 * @returns
 */
module.exports = function (bot, trigger, data) {
  var deets = parseTrigger(trigger);
  var url = deets.url;

  if (/(\{\d\})+/g.test(url) && !data.params.length) {
    return bot.sendChat("This trigger requires more data");
  }

  if (data.params.length > 0) {
    data.params.forEach((p, i) => {
      url = url.replace(`{${i}}`, p);
    });
  }

  const options = {
    headers: {
      Accept: "application/json",
    },
  };

  fetch(url, options)
    .then((res) => {
      if (res.ok) return res.json();
      else throw new Error(res.status.toString());
    })
    .then((json) => {
      let result = _get(json, deets.jsonPath, "No results");
      bot.sendChat(result);
    })
    .catch((error) => {
      bot.log("error", "BOT", `[!${trigger}] - triggerCode: ${error}`);
      bot.sendChat("Something happened connecting with trigger");
    });
};
