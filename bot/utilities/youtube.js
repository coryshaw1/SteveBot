'use strict';

var settings = require(process.cwd() + '/private/settings.js');
var YOUR_API_KEY = settings.YT_API;
var request = require('request');

// https://developers.google.com/youtube/v3/docs/videos#status

function makeYTurl(id) {
  return `https://www.googleapis.com/youtube/v3/videos?part=status&id=${id}&key=${YOUR_API_KEY}`;
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

function checkStatus(bot, ytID, body) {
  if (!body) { return; }
  var dj = bot.getDJ();

  var yt = JSON.parse(body);
  if (yt && yt.items && yt.items.length > 0 && yt.items[0].status) {
    
    var status = yt.items[0].status;

    // if one these bad uploadStatuses exist then we skip
    if (status.uploadStatus && badStatus.indexOf(yt.items[0].status.uploadStatus) > -1) {
      var reason = yt.items[0].status.uploadStatus;
      bot.log('info', 'BOT', `[SKIP] video with id ${ytID} had status of ${reason}`);
      return bot.moderateSkip(function(){
        bot.sendChat(`Sorry @${dj.username} this Youtube video is broken`);
      });
    }

    // if video is private then we skip
    if (status.privacyStatus && status.privacyStatus === 'private') {
      bot.log('info', 'BOT', `[SKIP] video with id ${ytID} was private}`);
      return bot.moderateSkip(function(){
        bot.sendChat(`Sorry @${dj.username} this Youtube video is broken`);
      });
    }

  }

  if (yt && yt.items && yt.items.length === 0){
    bot.log('info', 'BOT', `[SKIP] video with id ${ytID} doesn't exist anymore}`);
    // bot.sendChat('Is this video borken? Should I be skipping it?');
    return bot.moderateSkip(function(){
      bot.sendChat(`Sorry @${dj.username} this Youtube video is broken`);
    });
  }

}

module.exports = function(bot, ytID) {
  request(makeYTurl(ytID), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
      return checkStatus(bot, ytID, body);
    }
  });
};