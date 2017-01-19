'use strict';
var urban = require('urban');

function displayHelp(bot){
  bot.sendChat('*usage:* !urban [word or phrase]');
}

/*
sample response

{ definition: 'Glorified Ignorance ',
  permalink: 'http://faith.urbanup.com/2103793',
  thumbs_up: 902,
  author: 'Crayola_the_crayon_king',
  word: 'faith',
  defid: 2103793,
  current_vote: '',
  example: 'I love a person I have never met and have only heard stories of and there is no proof of outside of a single book, this is my faith.',
  thumbs_down: 682 }
 */

function showResult(bot, json){
  if (!bot) { return; }

  if (!json) {
    return bot.sendChat('Sorry no results for that');
  }

  let def = json.definition;
  let word = json.word;
  let link = json.permalink;

  bot.sendChat(`*${word}* - ${def} ${link}`);
}

module.exports = function(bot, db, data) {
  if (!bot || !data) { return; }

  if (data.params.length === 0) {
    urban.random().first(function(json) {
      showResult(bot, json);
    });
    return;
  }

  var search = data.params.join(" ");
  var find = urban(search);
  find.first(function(json) {
    showResult(bot, json);
  });


};