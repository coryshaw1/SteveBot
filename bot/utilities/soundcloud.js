'use strict';
/***********************************************************************
 * soundcloud.js
 * util wrapper around making requests to soundcloud and getting track info
 */
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;
const request = require('request');
const _ = require('lodash');

/**
 * 
 * @param {object} bot instance of Dubapi
 * @param {object} media dubapi song info from playlist-update event: data.media
 * @param {string} chatMsg the message the bot will send to chat
 * @param {string} logReason the message the bot will use when logging
 */
function doSkip(bot, media, chatMsg, logReason) {
  bot.log('info', 'BOT', `[SKIP] Soundcloud track - ${media.fkid} - ${media.name || 'unknown track name'} - ${logReason}`);

  if (bot.myconfig.autoskip_stuck) { 
    return bot.moderateSkip(function(){
      bot.sendChat(chatMsg);
    });
  }
}

/**
 * @typedef {Object} LinkResult
 * @property {string} error_message basic description of error
 * @property {string} link the full url to the soundcloud track
 * @property {boolen} skippable is this track skippable or not
 * @property {string} reason a more chat friendly reason why song is being skipped. 
 */

/**
 * Callback for handling request response from getSCjson
 *
 * @callback getSCjsonCallback
 * @param {LinkResult} result
 */

/**
 * Makes request to Soundcloud for a specific songs meta data
 * 
 * @param {object} bot instance of Dubapi
 * @param {object} media dubtrack media info object
 * @param {getSCjsonCallback} callback will be called on success/fail
 * @returns undefined
 */
function getLink(bot, media, callback) {
  if (!bot || !callback) { 
    console.log('warn', 'BOT', 'soundcloud.getLink missing bot or callback arguments');
    return; 
  }

  if (!media ){ return callback({error_message: 'soundcloud getSCjson: missing media object'}); }
  if (!media.fkid ){ return callback({error_message: 'soundcloud getSCjson: missing song id'}); }

  const songID = media.fkid;

  var options = {
    url: `https://api.soundcloud.com/tracks/${songID}.json?client_id=${settings.SOUNDCLOUDID}`
  };

  var responseBack = function(requestError, response, body) {
    var customResponse = {
      error_message : null,
      link : null,
      skippable : false,
      reason : null
    };

    // something happenend connecting to the API endpoint
    // we should NOT skip because we can't 100% know why this happened
    if (requestError) {
      bot.log('error', 'BOT', 'Soundcloud Error: ' + requestError);
      customResponse.error_message = "an error occured connecting to Soundcloud";
      return callback(customResponse);
    }

    // if body is null then response.statusCode is most likely 403 forbidden
    // meaning owner of the track has disabled API request for their song
    // we can definitely skip the track if this is the case
    if (!body) {
      customResponse.reason = 'Soundcloud link is broken';
      customResponse.skippable = true;
      customResponse.error_message = `${response.statusCode} - probably forbidden`;
      return callback(customResponse);
    }

    try {
      // this is where it gets tricky.  if body.errors exists, then we skip
      // anything else means probably means a good response
      var json = JSON.parse(body);
      var error404 = _.get(json, 'errors[0].error_message');
      if (error404) {
        customResponse.reason = 'Soundcloud track does not exist aynmore';
        customResponse.skippable = true;
        customResponse.error_message = `${error404}`;
        return callback(customResponse);
      } else {
        customResponse.link = _.get(json, 'permalink_url');
        return callback(customResponse);
      }
    } catch(e) {
      bot.log('error', 'BOT', `Soundcloud error parsing response.body - ${e}`);
      customResponse.error_message = 'error parsing soundcloud response.body';
      return callback(customResponse);
    }

  };

  request(options, responseBack);
}

module.exports = {
  getLink : getLink,
  skip : doSkip
};


