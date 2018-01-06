/**
 * chat-queue.js
 * 
 * Implements a simple internal rate limiting system so that we don't get
 * temp banned from Dubtrack for sending too many chats at once
 * 
 * helpful source: http://www.matteoagosti.com/blog/2013/01/22/rate-limiting-function-calls-in-javascript/
 */

'use strict';
const timers = require('timers');
const setTimeout = timers.setTimeout;

var _maxRate;
var _interval;
var _numOps = 0;
var _start;
var queue = [];
var bot;

function schedule(item) {
  var rate = 0,
      now = new Date().getTime(),
      elapsed = now - _start;

  if (elapsed > _interval) {
    _numOps = 0;
    _start = now;
  }

  rate = _numOps / elapsed;

  if (rate < _maxRate) {
    // if we are under our max rate we can process now

    if (queue.length === 0) {
      // queue is empty, run it immediately
      _numOps++;
      bot.realSendChat(item);

    } else {
      // FIFO, add it to the end of the queue
      if (item) queue.push(item);

      _numOps++;
      // run the first item in the queue
      let next = queue.shift();
      bot.realSendChat(next);
    }

  } else {
    if (item) queue.push(item);

    // we've exceeded our rate, trying again later
    setTimeout(function() {
      schedule();
    }, 1 / _maxRate);
  }
}

function ChatQueue(realbot, maxOps, interval) {
  bot = realbot;
  _maxRate = maxOps / interval;
  _interval = interval;
  _numOps = 0;
  _start = new Date().getTime();

  return {
    schedule : schedule
  };
}

module.exports = ChatQueue;