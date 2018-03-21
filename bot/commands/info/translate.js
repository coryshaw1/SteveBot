'use strict';
const urlPrefix = 'https://translate.google.com/#auto/en/';

module.exports = function(bot, db, data) {
  if(!data) { return; }
  
  // if just "!trigger" was used then we show the help info for using it
  if (data.params === void(0) || data.params.length < 1) {
    bot.sendChat('Generates a link to Google Translate link');
    bot.sendChat('usage: !translate text to translate');
    return;
  }

  var content = encodeURIComponent(data.params.join(' '));
  bot.sendChat(`${urlPrefix}${content}`);
};
