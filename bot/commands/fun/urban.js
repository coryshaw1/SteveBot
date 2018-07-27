'use strict';
const request = require('request');
const API_URL = "http://api.urbandictionary.com/v0/";


function showResult(bot, json){
  if (!bot) { return; }

  if (!json || !json.list || json.list.length === 0) {
    return bot.sendChat('Sorry no results for that');
  }

  var first = json.list[0];

  let def = first.definition;
  let word = first.word;
  let link = first.permalink;

  bot.sendChat(`*${word}* - ${def} ${link}`);
}

function getFirstResult(path, bot) {
  request(API_URL + path, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(body);
      showResult(bot, json);
    } else {
      bot.log('error', 'BOT', `[!urban] ${response.statusCode} ${error}`);
      bot.sendChat('Something happened connecting with urban dictionairy');
    }
  });
}

module.exports = function(bot, db, data) {
  if (!bot || !data) { return; }

  if (data.params.length === 0) {  
    getFirstResult("random", bot);
    return;
  }

  var search = encodeURI( data.params.join(" ").trim() );
  getFirstResult("define?term="+search, bot);

};