'use strict';
var config = require(process.cwd() + '/bot/config.js');

/**
 * [bot description]
 * @type {Object}
 */
var bot = {
  sendChat : function(x) { 
    // this doesn't return anything
    return;
  }, 
  getDJ : function() {
    // return DJ info object
    return {
      username : 'testDJname'
    };
  },
  getMedia : function() {
    // return a media object
    return {
      name : '',
      fkid : '',
      type : 'youtube'
    };
  },
  updub : function() {
    return; // do nothing
  },
  getUsers : function() {
    // return list of users
    return {};
  },
  on : function(event, callback) {
    // probably do nothing during testing
  },
  log : function() {
    console.log('bot.log: ', ...arguments);
  },
  isMod : function(user){
    return user && user.niceRole && user.niceRole === 'mod';
  },
  isCreator : function(user){
    return user && user.niceRole && user.niceRole === 'creator';
  },
  isOwner : function(user){
    return user && user.niceRole && user.niceRole === 'owner';
  },
  isManager : function(user){
    return user && user.niceRole && user.niceRole === 'manager';
  },
  isVIP : function(user){
    return user && user.niceRole && user.niceRole === 'vip';
  },
  isResidentDJ : function(user){
    return user && user.niceRole && user.niceRole === 'residentdj';
  },
  isSaff : function(user){
    return user && user.niceRole && user.niceRole === 'staff';
  },
  myconfig : config,
  commandedToDJ : false,
  isDJing : false
};

// need different kind of data responses
// 1. one without any params
// 2. one with params but just 1 item in the array
// 3. one with more items in the array
// 4. one without username
var dataResponse = {};

module.exports = {
  bot : bot,
  data : dataResponse
};