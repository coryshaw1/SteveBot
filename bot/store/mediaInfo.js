'use strict';
var sc = require(process.cwd() + '/bot/utilities/soundcloud.js');
var _ = require('lodash');
var repo = require(process.cwd()+'/repo');

var mediaStore = {
  current : {
    link : null,
    name : null,
    id : null,
    type : null,
    dj : null,
    length : 0,
    usersThatPropped : 0,
    usersThatFlowed : 0,
    when: 0
  },

  last : {
    link : null,
    name : null,
    id : null,
    type : null,
    dj : null,
    length : 0,
    usersThatPropped : 0,
    usersThatFlowed : 0,
    when: 0
  },

  getCurrent : function(){
    return this.current;
  },

  getLast : function(){
    return this.last;
  },

  lastPlayModel: function(currentSong, storedData) {
    let obj = {
      id : currentSong.id,
      type : currentSong.type,
      name : currentSong.name,
      plays : 1,
      firstplay : { 
        user : _.get(storedData , 'firstplay.user', currentSong.dj),
        when : _.get(storedData , 'firstplay.when', Date.now())
      }, 
      lastplay : {
        user : _.get(storedData , 'lastplay.user', currentSong.dj),
        when : _.get(storedData , 'lastplay.when', Date.now())
      }
    };

    if (storedData && storedData.plays) {
       obj.plays = storedData.plays + 1;
    }
    return obj;
  },

  setLast : function(db, song) {
    let that = this;

    if (typeof song === 'object' && song) {
      for (var key in song) {
        if (this.last.hasOwnProperty(key) ) {
          this.last[key] = song[key];
        }
      }

      if (!song.id) {return; }
      // look for the song in the db
      repo.getSong(db, song.id).then(function(data){
        // then save song in the db
        repo.saveSong(db, song.id, that.lastPlayModel(song, data.val()) );
      });
    }
  },

  setCurrent : function(x) {
    if (typeof x === 'object') {
      for (var key in x) {
        if (this.current.hasOwnProperty(key) ) {
          this.current[key] = x[key];
        }
      }
    }
  },

  setCurrentKey: function(key, value){
    if (this.current.hasOwnProperty(key) ) {
      this.current[key] = value;
    }
  },

  getLink : function(){
    return this.current.link;
  }
};

module.exports = mediaStore;