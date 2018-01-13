'use strict';
const _ = require('lodash');
const settings = require(process.cwd() + '/private/settings.js');
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

var getRandom = function (list) {
  return list[Math.floor((Math.random()*list.length))];
};

var responsesDE = [
  'Hey all, you\'ll never guess which country is blocking this video...',
  'Oh look, another video blocked in Germany',
  'Sucks to be :DE: right now',
  'This video is blocked in Germany, how ... unusual ... :confused: ',
  ':DE: :hear_no_evil: :mute: :-('
];

function trackIssue(db, ytResponse, media, reason){
  // repo.trackSongIssues(db, ytResponse, media, reason);
}

function makeYTCheckerUrl(yid){
  return `https://polsy.org.uk/stuff/ytrestrict.cgi?ytid=${yid}`;
}

function regionBlock(bot, db, _region, yt, media){
  // yes we get THAT many blocked youtube videos in Germany that we might
  // as well make fun of it
  if (_region.blocked && _region.blocked.length === 1 && _region.blocked[0] === 'DE') {
    // trackIssue(db, yt, media, 'region restrictions');
    bot.sendChat(`${media.name}`);
    return bot.sendChat( getRandom(responsesDE) );
  }

  bot.sendChat(`*FYI, Youtube is saying this video has region restrictions:*`);
  bot.sendChat(`${media.name}`);
  var ytid = _.get(yt, 'items[0].id');
  if (ytid) {
    var ytchk = makeYTCheckerUrl(ytid);
    bot.sendChat(`See here for more details: ${ytchk}`);
  }

  // trackIssue(db, yt, media, 'region restrictions');
}

function doSkip(bot, media, chatMsg, logReason) {
  bot.log('info', 'BOT', `[SKIP] YouTube video with id ${media.fkid} - ${logReason}`);

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
  dj = dj === void(0) ? '@'+dj : dj.username;

  var yt = JSON.parse(body);
  var status = _.get(yt, 'items[0].status');
  
  if (status) {
    
    // if one of these bad uploadStatuses exist then we skip
    if (badStatuses.indexOf(status.uploadStatus) > -1) {
      var reason = yt.items[0].status.uploadStatus;
      return doSkip(bot, media, `Sorry ${dj} this Youtube video is broken`, reason);
    }

    // if video is private then we skip
    if (_.get(status, 'privacyStatus') === 'private') {
      return doSkip(bot, media, `Sorry ${dj} this Youtube video is private`, 'private');
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

  // var savedIssue = null;
  // var now = Date.now();

  // repo.getSongIssue(db, media.fkid)
  //   .then(function(snapshot){
  //     savedIssue = snapshot.val();
      
  //     // if the song issue doesn't exist (so it's a new issue)
  //     // OR it was tracked more than 15min ago
  //     if (!savedIssue || now - savedIssue.timestamp > 900000) {
  //       start(bot, db, media);
  //     }

  //   })
  //   .catch(function(err){});
};