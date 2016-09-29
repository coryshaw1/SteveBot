'use strict';

var settings = require(process.cwd() + '/private/settings.js');
var repo = require(process.cwd()+'/repo');
var YOUR_API_KEY = settings.YT_API;
var request = require('request');
// https://developers.google.com/youtube/v3/docs/videos#status

var Youtube = {
  'base' : 'https://www.googleapis.com/youtube/v3/videos?',
  options : {
    part : 'status,contentDetails',
    key : settings.YT_API
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
  
  https://developers.google.com/youtube/v3/docs/videos#status.uploadStatus
  https://developers.google.com/youtube/v3/docs/videos#contentDetails.regionRestriction
 */
var badStatus = [
  'deleted',
  'failed',
  'rejected'
];

var getRandom = function (list) {
  return list[Math.floor((Math.random()*list.length))];
};

var responsesDE = [
  'Hey all, you\'ll never guess which country is blocking this video...',
  'Oh look, another video blocked in Germany (Deutschland)',
  'Sorry my German Chillout humanoid friends, you won\'t be able to hear this track, it\'s blocked in your country.',
  'This video is blocked in Germany, how ... unusual ... :confused: ',
  'Please sign my petition to allow the German peoples to hear chill music so they can finally hear great tracks like this.  Thank you.'
];

function trackIssue(db, ytResponse, media, reason){
  repo.trackSongIssues(db, ytResponse, media, reason);
}

function checkStatus(bot, db, media, body) {
  if (!body) { return; }

  // set DJ name
  var dj = bot.getDJ();
  dj = dj === void(0) ? '@'+dj : dj.username;

  var yt = JSON.parse(body);
  if (yt && yt.items && yt.items.length > 0 && yt.items[0].status) {
    
    var status = yt.items[0].status;

    // if one these bad uploadStatuses exist then we skip
    if (status.uploadStatus && badStatus.indexOf(yt.items[0].status.uploadStatus) > -1) {
      var reason = yt.items[0].status.uploadStatus;

      // log issues to console and to firebase
      bot.log('info', 'BOT', `[SKIP] video with id ${media.fkid} had status of ${reason}`);
      trackIssue(db, yt, media, `${reason}`);

      // skip it and send message
      return bot.moderateSkip(function(){
        bot.sendChat(`Sorry ${dj} this Youtube video is broken`);
      });
    }

    // if video is private then we skip
    if (status.privacyStatus && status.privacyStatus === 'private') {
      // log to console and firebase
      bot.log('info', 'BOT', `[SKIP] video with id ${media.fkid} was private`);
      trackIssue(db, yt, media, 'private');

      // skip it and send message
      return bot.moderateSkip(function(){
        bot.sendChat(`Sorry ${dj} this Youtube video is private`);
      });
    }

  }

  // check if a video has region restrictions. For now just put that info in the chat
  // and log it, but do nothing else
  if (yt && yt.items && yt.items.length > 0 && yt.items[0].contentDetails) {
    if (yt.items[0].contentDetails.regionRestriction) {
        var _region = yt.items[0].contentDetails.regionRestriction;
        
        // yes we get THAT many blocked youtube videos in Germany that we might
        // as well make fun of it
        if (_region.blocked && _region.blocked.length === 1 && _region.blocked[0] === 'DE') {
          trackIssue(db, yt, media, 'region restrictions');
          bot.sendChat(`${media.name}`);
          return bot.sendChat( getRandom(responsesDE) );
        }

        bot.sendChat(`*FYI, this Youtube video has some region restrictions:*`);
        bot.sendChat(`${media.name}`);
        
        if (_region.allowed && _region.allowed.length > 0) {
          var _a = Array.isArray(_region.allowed) ? _region.allowed.join(',') : _region.allowed; 
          bot.sendChat('*allowed in:* ' + _a);
        }
        if (_region.blocked && _region.blocked.length > 0) {
          var _b = Array.isArray(_region.blocked) ? _region.blocked.join(',') : _region.blocked;
          bot.sendChat('*blocked in:* ' + _b);
        }
        trackIssue(db, yt, media, 'region restrictions');
    }
  }

  if (yt && yt.items && yt.items.length === 0){
    // log to console and firebase
    bot.log('info', 'BOT', `[SKIP] video with id ${media.fkid} doesn't exist anymore`);
    trackIssue(db, yt, media, 'video doesn\'t exist');
    
    // skip it and send message
    return bot.moderateSkip(function(){
      bot.sendChat(`Sorry ${dj} this Youtube video is broken`);
    });
  }

}

module.exports = function(bot, db, media) {
  if (!settings || !YOUR_API_KEY || !media || !bot) { return; }

  request(makeYTurl(media.fkid), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return checkStatus(bot, db, media, body);
    }
  });
};