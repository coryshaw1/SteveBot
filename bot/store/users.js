'use strict';


var UserStore = {
  usersThatPropped : [],
  usersThatFlowed : [],

  getFlows : function(){
    return this.usersThatFlowed;
  },
  getProps : function(){
    return this.usersThatPropped;
  },

  addPoint : function(type, id){
    if (!type || !id) {return;}
    this[type].push(id);
  },

  hasId: function(type, id){
    if (!type || !id) {return;}
    return this[type].indexOf(id) >= 0;
  },

  clear : function(){
    this.usersThatPropped = [];
    this.usersThatFlowed = [];
  }
};

module.exports = UserStore;

