'use strict';
/***********************************************************************
 * soundcloud.js
 * util wrapper around making requests to soundcloud and getting track info
 */
const _private = require(process.cwd() + '/private/get'); 
const settings = _private.settings;
const request = require('request');
const _ = require('lodash');

function doSkip(bot, media, chatMsg, logReason) {
  bot.log('info', 'BOT', `[SKIP] Soundcloud track - ${media.fkid} - ${media.name || 'unknown track name'} - ${logReason}`);

  if (bot.myconfig.autoskip_stuck) { 
    return bot.moderateSkip(function(){
      bot.sendChat(chatMsg);
    });
  }
}

/**
 * Callback for handling request response from getSCjson
 *
 * @callback getSCjsonCallback
 * @param {object} error - error object or null 
 * @param {object} response - request response or null.
 */
/**
 * Makes request to Soundcloud for a specific songs meta data
 * 
 * @param {object} bot instance of Dubapi
 * @param {object} media dubtrack media info object
 * @param {getSCjsonCallback} callback will be called on success/fail
 * @returns undefined
 */
function getSCjson(bot, media, callback) {
  if (!bot || !callback) { return; } // silent return; 
  if (!media ){ return callback({error_message: 'soundcloud getSCjson: missing media object'}, null); }
  if (!media.fkid ){ return callback({error_message: 'soundcloud getSCjson: missing song id'}, null); }

  const songID = media.fkid;

  var options = {
    url: `https://api.soundcloud.com/tracks/${songID}.json?client_id=${settings.SOUNDCLOUDID}`
  };

  var responseBack = function(requestError, response, body) {
    // if callback returns this, we should NOT skip because we can't 100% know
    // that it was a track issue. Maybe server went offline for a moment.  
    if (requestError) {
      bot.log('error', 'BOT', 'Soundcloud Error: ' + requestError);
      return callback(requestError, null);
    }

    // if body is null then response.statusCode is most likely 403 forbidden
    // meaning owner of the track has disabled API request for their song
    // we can definitely skip the track if this is the case
    if (!body) {
      bot.log('error', 'BOT', `Soundcloud track returned null response - status: ${response.statusCode} -  for track ${media.name || 'unknown track name'}`);
      return callback(null, null);
    }

    try {
      // this is where it gets tricky.  if body.errors exists, then we skip
      // anything else means good reponse
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
      return callback({error_message: 'error parsing body'}, null);
    }

  };

  request(options, responseBack);
}


/**
 * Makes request to Soundcloud for a specific songs meta data
 * 
 * @param {object} bot instance of Dubapi
 * @param {object} media dubtrack media info object
 * @returns undefined
 */
function moderate(bot, media) {
  if (!bot || !media || !media.fkid) { return; } // silent return; not skipping

  const songID = media.fkid;

  var options = {
    url: `https://api.soundcloud.com/tracks/${songID}.json?client_id=${settings.SOUNDCLOUDID}`
  };

  var responseBack = function(requestError, response, body) {
    // if callback returns this, we should NOT skip because we can't 100% know
    // that it was a track issue. Maybe server went offline for a moment.  
    if (requestError) {
      bot.log('error', 'BOT', 'Soundcloud Error: ' + requestError);
      return;
    }

    // if body is null then response.statusCode is most likely 403 forbidden
    // meaning owner of the track has disabled API request for their song
    // we can definitely skip the track if this is the case
    if (!body) {
      return doSkip(bot, media, 'Soundcloud user disabled their track from being accessed via API', 'probably because forbidden');
    }

    try {
      // this is where it gets tricky.  if body.errors exists, then we skip
      // anything else means good reponse
      var json = JSON.parse(body);
      var error404 = _.get(json, 'result.errors[0].error_message', null);
      if (error404) {
        return doSkip(bot, media, 'Soundcloud track does not exist aynmore', `${error404 || 'unknown error'}`);
      }
    } catch(e) {
      bot.log('error', 'BOT', `Soundcloud error parsing response.body - ${e}`);
    }

  };

  request(options, responseBack);
}

module.exports = {
  getLink : getSCjson,
  moderate : moderate
};


