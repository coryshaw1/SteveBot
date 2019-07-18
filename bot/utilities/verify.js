'use strict';
/**
 * Verifier
 * Utility to add a "are you sure?" functionality 
 * it waits for a 'yes/no' response within in given amount of time
 */

const setInterval = require('timers').setInterval;
const clearInterval = require('timers').clearInterval;

const responseTime = 30; // in seconds
const countLimit = 3; // how many times within the alotted response time you want to remind the user

module.exports = function Verifier(bot, data, actionText) {
  if (!bot || !data) {
    return;
  }
  
  return new Promise(function(resolve, reject){
    // store orginal user name for comparison later
    let user = data.user.username;
    // send the warning message
    bot.sendChat(`@${user}: are you sure you want to ${actionText}? [yes/no] - you have ${responseTime} seconds to respond`);
    // store if the user has responded or not
    let answered = false;

    // setup new temporary chat message listener
    function verifyListner(_data){
      if (_data.user.username === user) {
        if (/^y(es)?$/i.test(_data.message)) {
          answered = true;
          bot.removeListener(bot.events.chatMessage, verifyListner);
          resolve(true);
        } else if (/^no?$/i.test(_data.message)) {
          answered = true;
          bot.removeListener(bot.events.chatMessage, verifyListner);
          resolve(false);
        } else {
          bot.sendChat(`@${user}, you must only respond with 'yes' or 'no'`);
        }
      }
    }
    
    bot.on(bot.events.chatMessage, verifyListner);
    
    let count = 1;
    let interval = (responseTime / countLimit);

    let check = setInterval(()=>{
      if (answered) {
        clearInterval(check);
        return;
      }

      if (count < countLimit) { 
        let newTime = responseTime - (count * interval);
        bot.sendChat(`@${user}: are you sure you want to _${actionText}_? [y/n] - you have ${newTime} seconds to respond`);
        count++;
        return;
      }

      if (count >= countLimit) {
        // if still not answered then we auto reject and disable the listener
        bot.removeListener(bot.events.chatMessage, verifyListner);
        bot.sendChat(`@${user}: you have not responded in time, cancelling _${actionText}_`);
        clearInterval(check);
        reject();
        return;
      }
      
    }, interval * 1000);
  });
};