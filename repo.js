'use strict';
var log = require('jethro');
log.setTimeformat('YYYY-MM-DD HH:mm:ss:SSS');

var _env = process.env.ENV;
if (_env === null || typeof _env === 'undefined' || _env === '') {
  _env = 'dev';
}

/**
 * Find a user by user.id
 * @param  {Object}   db       Firebase object
 * @param  {int}      userid   
 * @param  {Function} callback
 */
var findUserById = function(db, userid, callback) { 
  var user = db.ref(_env + '/users/' + userid);
  user.once('value', function(snapshot){
      var val = snapshot.val();
      callback(val);
    }, function(error){
      log('error', 'REPO', 'findUserById :' + error.code);
  });
};

/**
 * Update a users data in the db
 * @param  {Object}   db       Firebase object
 * @param  {int}      userid
 * @param  {Object}   data     Object containing key/values of what is to be updated
 * @param  {Function} callback
 */
var updateUser = function(db, userid, data, callback) {
  var updateRef = db.ref(_env + '/users').child(userid);
  updateRef.update(data, callback);
};

/**
 * Pretty self explanatory
 * @param  {Object}   db       Firebase Object
 * @param  {Object}   user     DT user object
 * @param  {Function} callback 
 */
var insertUser = function(db, user, callback) {
  var usersRef = db.ref(_env + '/users');
  var extraStuff = {
    props : 0,
    flow : 0,
    DateAdded : new Date(),
    LastConnected : new Date()
  };
  var finalNewUser = Object.assign({}, user, extraStuff);
  Object.keys(finalNewUser).forEach(function(key){
    if ( finalNewUser[key] === void(0)/* aka undefined */ ){ 
      finalNewUser[key] = null; 
    }
  });
  usersRef.child(user.id).set(finalNewUser, callback);
};

/**
 * Logs a user to the db
 * @param  {Object}   db       Firebase object
 * @param  {Object}   user     DT user object
 * @param  {Function} callback [description]
 */
var logUser = function(db, user, callback) {
  findUserById(db, user.id, function(foundUser) {
    
    if(!foundUser){
      
      insertUser(db, user, function(error){
        if (error) {
          return log('error', 'REPO', 'logUser:' + user.id + ' could not be saved');
        }

        user.logType = 'inserted';
        return callback(user);
      });
      
    } else {
      var newdata = {
        'dubs': user.dubs || null,
        'LastConnected': Date.now(),
        'flow' : user.flow || 0,
        'props' : user.props || 0
      };

      updateUser(db, user.id, newdata, function(error){
        if (error) {
          return log('error', 'REPO', 'logUser:' + user.id + ' could not be saved');
        }

        user.logType = 'updated';
        return callback(user);
      });

    }
  });
};


/**
 * Increment by 1, a value of a user
 * @param  {Object}   db       Firebase Object
 * @param  {Object}   user     
 * @param  {String}   thing    The property to be incremented by
 * @param  {Function} callback [description]
 */
var incrementUser = function(db, user, thing, callback) {
  var incUser = db.ref(_env + '/users/' + user.id + '/' + thing);
  incUser.transaction(
    // increment prop by 1
    function (currentValue) {
      return (currentValue || 0) + 1;
    },
    // completion handler
    function (error) {
      if (error) {
        log('error', 'REPO', 'incrementUser:' + error);
        callback();
      } else {
        findUserById(db, user.id, function(foundUser){
          return callback(foundUser);
        });
      }
    }
  );
};

/**
 * Pass through to incrementUser function for props
 */
var propsUser = function(db, user, callback) {
  incrementUser(db, user, 'props', callback);
};

/**
 * Pass through to incrementUser function for hearts
 */
var heartsUser = function(db, user, callback) {
  incrementUser(db, user, 'hearts', callback);
};

/**
 * Pass through to incrementUser function for flow
 */
var flowUser = function(db, user, callback) {
  incrementUser(db, user, 'flow', callback);
};

/**
 * Sort by a specific user property and return array
 * @param  {Object}   db       Firebase database obj
 * @param  {string}   prop     name of the property to sort by
 * @param  {int}      limit    
 * @param  {Function} callback 
 */
var getLeaders = function(db, prop, limit, callback) {
  return db.ref(_env + '/users')
    .orderByChild(prop)
    .limitToLast(limit)
    .once('value', function(snapshot) {
      callback(snapshot.val());
    });
};

/**
 * Get a trigger from the database
 * @param  {Object}   bot         dubapi instance
 * @param  {Object}   db          Firebase instance
 * @param  {String}   triggerName trigger to look up
 * @param  {Function} callback    
 */
var getTrigger = function (bot, db, triggerName, callback) {
  db.ref('triggers')
    .orderByChild('Trigger')
    .equalTo(triggerName + ':')
    .once('value', function(snapshot) {
      var val = snapshot.val();
      if (typeof callback === 'function') {
        return callback(val);
      }
  });
};

/**
 * Updates a trigger in the DB
 * @param  {Object} db   Firebase instance
 * @param  {Object} data Trigger data, see function for details, needs {Author, Returns, Trigger}
 * @return {Firebase.Promise}
 */
var updateTrigger = function(db, data, triggerKey){
  if (!triggerKey || !data || !data.triggerText || !data.triggerText) { return; }
  var updateObj = {
    Author: data.user.username,
    Returns: data.triggerText,
    Trigger: data.triggerName + ':'
  };
  return db.ref('triggers/'+triggerKey).set(updateObj);
};

/**
 * Insert a new trigger into the DB
 * @param  {Object} db   Firebase instance
 * @param  {Object} data Trigger data, see function for details, needs {Author, Returns, Trigger}
 * @return {Firebase.Promise}
 */
var insertTrigger  = function(db, data) {
  if (!data || !data.triggerText || !data.triggerText) { return; }
  return db.ref('triggers').push().set({
    Author: data.user.username,
    Returns: data.triggerText,
    Trigger: data.triggerName + ':'
  });
};

/**
 * Delete a trigger in the db
 * @param  {Object} db         Firebase Instance
 * @param  {String} triggerKey The key of the location of the trigger
 * @return {Firebase.Promise}  Returns a promise
 */
var deleteTrigger = function(db, triggerKey) {
  if (!triggerKey) { return; }
  return db.ref('triggers/' + triggerKey).set(null);
};

/**
 * Pretty self explanatory
 * @param  {Object}   db       Firebase Object
 * @param  {Object}   media    DubApi's current media info object
 * @param  {String|Int} id     data.media.fkid
 * @param  {String} reason      what the issue was
 * @param  {Function} callback 
 */
var trackSongIssues = function(db, ytResponse, media, reason) {
  var songIssues = db.ref('/song_issues');
  
  ytResponse.reason = reason;
  ytResponse.date = new Date();
  ytResponse.timestamp = Date.now();

  var saveObj = Object.assign({}, ytResponse, media);

  songIssues.child(media.fkid).set(saveObj, function(err){
    if (err) { 
      log('error', 'REPO', 'trackSongIssues: Error saving for id ' + media.fkid);
    }
  });
};

module.exports = {
  logUser  : logUser,
  findUserById  : findUserById,
  updateUser  : updateUser,
  insertUser  : insertUser,
  propsUser  : propsUser,
  heartsUser  : heartsUser,
  flowUser : flowUser,
  getLeaders : getLeaders,
  incrementUser : incrementUser,
  getTrigger : getTrigger,
  updateTrigger : updateTrigger,
  insertTrigger : insertTrigger,
  deleteTrigger : deleteTrigger,
  trackSongIssues : trackSongIssues
};