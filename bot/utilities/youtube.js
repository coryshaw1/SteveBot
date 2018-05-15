'use strict';
const _ = require('lodash');
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;
const repo = require(process.cwd()+'/repo');
const YOUR_API_KEY = settings.YT_API;
const request = require('request');
// var countryCodes = require(process.cwd() + '/bot/utilities/countries.js');


var Youtube = {
  'base' : 'https://www.googleapis.com/youtube/v3/videos?',
  options : {
    part : 'status,contentDetails',
    key : YOUR_API_KEY
  }
};

function makeYTurl(id) {
  var queryString = [];
  Youtube.options.id = id;
  for (var key in Youtube.options) {
    queryString.push(key + '=' + Youtube.options[key] );
  }
  return Youtube.base + queryString.join('&');
}

/*
  example of a bad video: fuOgXVlscZA
  "status": {
      "uploadStatus": "rejected",
      "rejectionReason": "uploaderAccountSuspended",
      "privacyStatus": "public",
      "license": "youtube",
      "embeddable": true,
      "publicStatsViewable": true
     }

    status.privacyStatus
  https://developers.google.com/youtube/v3/docs/videos#status
  https://developers.google.com/youtube/v3/docs/videos#status.uploadStatus
  https://developers.google.com/youtube/v3/docs/videos#contentDetails.regionRestriction
 */
var badStatuses = [
  'deleted',
  'failed',
  'rejected'
];

function makeYTCheckerUrl(yid){
  return `https://polsy.org.uk/stuff/ytrestrict.cgi?ytid=${yid}`;
}

function regionBlock(bot, db, _region, yt, media){
  bot.sendChat(`*FYI, Youtube is saying this video has region restrictions:* - ${media.name}`);
  var ytid = _.get(yt, 'items[0].id');
  if (ytid) {
    var ytchk = makeYTCheckerUrl(ytid);
    bot.sendChat(`See here for more details: ${ytchk}`);
  }
}

function doSkip(bot, media, chatMsg, logReason) {
  bot.log('info', 'BOT', `[SKIP] YouTube video: ${media.fkid} - ${media.name||'unknown track'} - ${logReason}`);

  if (bot.myconfig.autoskip_stuck) { 
    return bot.moderateSkip(function(){
      bot.sendChat(chatMsg);
    });
  }
}

function checkStatus(bot, db, media, body) {
  if (!body) { return; }

  // set DJ name
  var dj = bot.getDJ();
  dj = dj === void(0) ? 'dj' : dj.username;

  var yt = JSON.parse(body);
  var status = _.get(yt, 'items[0].status');
  
  if (status) {
    
    // if one of these bad uploadStatuses exist then we skip
    if (badStatuses.includes(status.uploadStatus)) {
      var reason = yt.items[0].status.uploadStatus;
      return doSkip(bot, media, `Sorry @${dj} this Youtube video is broken`, reason);
    }

    // if video is private then we skip
    if (_.get(status, 'privacyStatus') === 'private') {
      return doSkip(bot, media, `Sorry @${dj} this Youtube video is private`, 'private');
    }

  }

  // check if a video has region restrictions. For now just put that info in the chat
  // and log it, but do nothing else
  var _region = _.get(yt, 'items[0].contentDetails.regionRestriction');
  if (_region) {
    regionBlock(bot, db, _region, yt, media);
  }

  // video doesn't exist anymore
  if (yt && yt.items && yt.items.length === 0){
    return doSkip(bot, media, `Sorry ${dj} this Youtube video does not exist anymore`, "doesn't exist anymore");
  }

}

var start = function(bot, db, media){
  request(makeYTurl(media.fkid), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return checkStatus(bot, db, media, body);
    }
  });
};

module.exports = function(bot, db, media) {
  if (!settings || !YOUR_API_KEY || !media || !bot) { return; }

  start(bot, db, media);
  return;
};