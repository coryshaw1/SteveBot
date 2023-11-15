'use strict';
const _ = require('lodash');
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;
const YOUR_API_KEY = settings.YT_API;

const Youtube = {
  'base' : 'https://www.googleapis.com/youtube/v3/videos?',
  options : {
    part : 'status,contentDetails',
    key : YOUR_API_KEY
  }
};

/**
 * 
 * @param {string} id 
 * @returns {string}
 */
function makeYTurl(id) {
  const queryString = [];
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
const badStatuses = [
  'deleted',
  'failed',
  'rejected'
];

/**
 * 
 * @param {string} yid 
 * @returns {string}
 */
function makeYTCheckerUrl(yid){
  return `https://polsy.org.uk/stuff/ytrestrict.cgi?ytid=${yid}`;
}

/**
 * 
 * @param {DubAPI} bot 
 * @param {*} db 
 * @param {string} _region 
 * @param {object} yt 
 * @param {object} media 
 */
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

/**
 * 
 * @param {DubAPI} bot 
 * @param {object} db 
 * @param {object} media 
 * @param {unknown} json 
 * @returns 
 */
function checkStatus(bot, db, media, json) {
  if (!json) { return; }

  // set DJ name
  const dj = bot.getDJ()?.username || 'dj';
  
  const status = _.get(json, 'items[0].status');
  
  if (status) {
    
    // if one of these bad uploadStatuses exist then we skip
    if (badStatuses.includes(status.uploadStatus)) {
      var reason = json.items[0].status.uploadStatus;
      return doSkip(bot, media, `Sorry @${dj} this Youtube video is broken`, reason);
    }

    // if video is private then we skip
    if (_.get(status, 'privacyStatus') === 'private') {
      return doSkip(bot, media, `Sorry @${dj} this Youtube video is private`, 'private');
    }

  }

  // check if a video has region restrictions. For now just put that info in the chat
  // and log it, but do nothing else
  var _region = _.get(json, 'items[0].contentDetails.regionRestriction');
  if (_region) {
    regionBlock(bot, db, _region, json, media);
  }

  // video doesn't exist anymore
  if (json && json.items && json.items.length === 0){
    return doSkip(bot, media, `Sorry ${dj} this Youtube video does not exist anymore`, "doesn't exist anymore");
  }

}

/**
 * 
 * @param {DubAPI} bot 
 * @param {*} db 
 * @param {*} media 
 */
var start = function(bot, db, media){
  fetch(makeYTurl(media.fkid))
    .then((res) => {
      if (res.ok) return res.json();
      else throw new Error(res.status.toString());
    })
    .then((json) => checkStatus(bot, db, media, json))
    .catch((error) => {
      bot.log('error', 'BOT', `[!yt] ${error}`);
      bot.sendChat('Something happened connecting with Youtube');
    });
};

/**
 * 
 * @param {DubAPI} bot 
 * @param {*} db 
 * @param {*} media 
 */
module.exports = function(bot, db, media) {
  if (!settings || !YOUR_API_KEY || !media || !bot) { return; }

  start(bot, db, media);
};