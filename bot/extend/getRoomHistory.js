"use strict";
const _ = require("lodash");

/***********************************************************************
 * This module grabs the playlist history from a room
 * It uses JS Generators so make sure your Node version supports it
 * http://node.green/#generators
 * node >= 4.0.0
 **/

/***********************************************************************
 * Stubs for parts of DubAPI
 **/

// location of the dubapi package
let loc = process.cwd() + "/node_modules/dubapi";

// include some necessary parts
const DubAPIError = require(loc + "/lib/errors/error.js");
const DubAPIRequestError = require(loc + "/lib/errors/requestError.js");
const endpoints = require(loc + "/lib/data/endpoints.js");

endpoints.roomPlaylistHistory = "room/%RID%/playlist/history?page=%PAGENUM%";

/************************************************************************/

/**
 * return array sequential history endpoints
 * @param  {string} roomID  the RoomID (might be an int, I'm not sure. doesnt matter)
 * @param  {number} pages  total number of history pages desired
 * @return {string[]}          Array of url strings
 */
function makeRequestArray(roomID, pages) {
  var url = endpoints.roomPlaylistHistory.replace("%RID%", roomID);
  var result = [];
  for (var i = 1; i <= pages; i++) {
    result.push(url.replace("%PAGENUM%", i));
  }
  return result;
}

// store our module-scoped generator
/**
 * @type {IterableIterator<string>}
 */
var hist;

/**
 * Make requests to url and return results to yield
 * @param  {object} context "this" of DubAPI
 * @param  {string} url     The url to make GET request to
 */
function requestWrapper(context, url) {
  /**
   * @param {number} code
   * @param {{ data: any }} body
   */
  function handleQueue(code, body) {
    if (code !== 200) {
      context.emit("error", new DubAPIRequestError(code, url));
      hist.next(null);
    } else {
      hist.next(body.data);
    }
  }

  context._.reqHandler.queue({ method: "GET", url }, handleQueue);
}

/**
 * Main Generator function to iterate over array at our own pace
 * @param {object} context       the "this" of the DubAPI
 * @param {string[]} reqArray       the array of history urls that we will be calling
 * @param {(history: string[]) => void} doneCB      on complete, this will be exec passing history[] to it
 * @returns {IterableIterator<void>}
 */
function* history(context, reqArray, doneCB) {
  /**
   * @type {string[]}
   */
  let history = [];

  for (let i = 0; i < reqArray.length; i++) {
    const result = yield requestWrapper(context, reqArray[i]);
    if (result) {
      history = history.concat(result);
    }
  }
  if (typeof doneCB === "function") {
    doneCB(history);
  }
}

/**
 * API for module. This is what you will be calling externally
 * @param  {number}   pages       number of pages of history to retrieve
 * @param  {()=>void} callback when all history pages are retrieved, this funciton will be run
 */
function getRoomHistory(pages, callback) {
  /* jshint validthis:true */
  if (!this._.connected) {
    return false;
  }

  // make sure we can get roomid
  var roomid = _.get(this, "_.room.id");
  if (!roomid) {
    return false;
  }

  // make an array of urls to iterate requests
  var reqs = makeRequestArray(roomid, pages);

  // start History generator function
  hist = history(this, reqs, callback);
  hist.next();
}

module.exports = getRoomHistory;
