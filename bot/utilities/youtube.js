'use strict';

var settings = require(process.cwd() + '/private/settings.js');
var repo = require(process.cwd()+'/repo');
var YOUR_API_KEY = settings.YT_API;
var request = require('request');

// https://developers.google.com/youtube/v3/docs/videos#status

function makeYTurl(id) {
  return `https://www.googleapis.com/youtube/v3/videos?part=status,contentDetails&id=${id}&key=${YOUR_API_KEY}`;
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

function trackIssue(db, obj, id, reason){
  repo.trackSongIssues(db, obj, id, reason);
}

function checkStatus(bot, db, ytID, body) {
  if (!body || !bot || !db) { return; }

  // set DJ name
  var dj = bot.getDJ().username || '';
  if (dj !== ''){ dj = '@'+dj; }

  var yt = JSON.parse(body);
  if (yt && yt.items && yt.items.length > 0 && yt.items[0].status) {
    
    var status = yt.items[0].status;

    // if one these bad uploadStatuses exist then we skip
    if (status.uploadStatus && badStatus.indexOf(yt.items[0].status.uploadStatus) > -1) {
      var reason = yt.items[0].status.uploadStatus;

      // log issues to console and to firebase
      bot.log('info', 'BOT', `[SKIP] video with id ${ytID} had status of ${reason}`);
      trackIssue(db, yt, ytID, `${reason}`);

      // skip it and send message
      return bot.moderateSkip(function(){
        bot.sendChat(`Sorry ${dj} this Youtube video is broken`);
      });
    }

    // if video is private then we skip
    if (status.privacyStatus && status.privacyStatus === 'private') {
      // log to console and firebase
      bot.log('info', 'BOT', `[SKIP] video with id ${ytID} was private`);
      trackIssue(db, yt, ytID, 'private');

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
      
        bot.sendChat(`FYI, this video has some region restrictions`);

        if (_region.allowed && _region.allowed.length > 0) {
          var _a = Array.isArray(_region.allowed) ? _region.allowed.join(',') : _region.allowed; 
          bot.sendChat('> *allowed in:* `' + _a + '`');
        }
        if (_region.blocked && _region.blocked.length > 0) {
          var _b = Array.isArray(_region.blocked) ? _region.blocked.join(',') : _region.blocked;
          bot.sendChat('> *blocked in:* `' + _b + '`');
        }
        trackIssue(db, yt, ytID, 'region restrictions');
    }
  }

  if (yt && yt.items && yt.items.length === 0){
    // log to console and firebase
    bot.log('info', 'BOT', `[SKIP] video with id ${ytID} doesn't exist anymore`);
    trackIssue(db, yt, ytID, 'video doesn\'t exist');
    
    // skip it and send message
    return bot.moderateSkip(function(){
      bot.sendChat(`Sorry ${dj} this Youtube video is broken`);
    });
  }

}

module.exports = function(bot, db, ytID) {
  if (!settings || !YOUR_API_KEY || !ytID || !bot) { return; }

  request(makeYTurl(ytID), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return checkStatus(bot, db, ytID, body);
    }
  });
};