'use strict';
const _ = require('lodash');

/***********************************************************************
* Store and retrieve Direct messages
* pluss init polling for new messages
**/

var dmStore = {
  messages : {},

  markRead : function(bot, messageArr) {
    messageArr.forEach(function(msg){
      bot.markRead(bot, msg.id, function(err){
        if (err) {
          bot.log('error', 'BOT', `DM: error marking ${msg.id} as read: ${err.code} ${err.message}`);
        }
      });
    });
  },

  reformat : function(msgArray) {
    // take array containing objects that each of a unique id key 
    // and make it into a master object using that id as key
    // so turning this:
    //      [ {id: 1, msg: "asda"}, {id: 2, msg "hello"} ]
    // into this:
    //      { 1 : { msg: "asda"}, 2: {msg "hello"} }
    var newObj = {};
    msgArray.forEach(function(msg){
      newObj[msg._id] = msg;
    });
    return newObj;
  },

  update : function(bot) {
    bot.DM.getAll(bot, (err,data)=>{
      if (err !== 200) {
         bot.log('error', 'BOT', 'DM: error getting all direct messages on connection');
      }
      if (data.code === 200) {
        // store all messages 
        this.messages = this.reformat(data.data);
      }
    });
  },

  init : function(bot) {
    this.update(bot);
  }
};

module.exports = dmStore;