'use strict';
var mediaStore = require(process.cwd()+ '/bot/store/mediaInfo.js');
var _ = require('lodash');

function makeYTCheckerUrl(yid){
  return `https://polsy.org.uk/stuff/ytrestrict.cgi?ytid=${yid}`;
}

module.exports = function(bot, db, data) {
  if(!data) { return; }
  var current = mediaStore.getCurrent();  
  var restrictions = '';

  var whoAsked = _.get(data, 'user.username', '');
  if (whoAsked){ 
    whoAsked = "@"+whoAsked;
  }

  if(!current.link) {
    bot.sendChat('Sorry I couldn\'t get the link for this track');
  } else {
    if (current.type === 'youtube') {
      restrictions = ` - YouTube region restriction info: ${makeYTCheckerUrl(current.id)}`;
    }
    bot.sendChat(`${whoAsked} - ${current.link}${restrictions}`);
  }
};
