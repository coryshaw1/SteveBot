"use strict";
const log = require("jethro");
log.setTimestampFormat(null, "YYYY-MM-DD HH:mm:ss:SSS");
const _ = require("lodash");

/**
 * Find a user by user.id
 * @param {object}   db       Firebase object
 * @param {number}      userid
 * @param {(val: object) => void} callback
 */
const findUserById = function (db, userid, callback) {
  const user = db.ref("users").child(userid);
  user.once(
    "value",
    function (snapshot) {
      const val = snapshot.val();
      callback(val);
    },
    function (error) {
      log("error", "REPO", "findUserById :" + error.code);
    }
  );
};

/**
 * Update a users data in the db
 * @param {object}   db       Firebase object
 * @param {number}      userid
 * @param {object}   data     Object containing key/values of what is to be updated
 * @param {() => void)} callback
 */
const updateUser = function (db, userid, data, callback) {
  const updateRef = db.ref("users").child(userid);
  updateRef.update(data, callback);
};

/**
 * Update the entire db.users object as a whole
 * @param {object} db  Firebase instance
 * @param {object} data all user data
 * @returns {Promise}
 */
const updateAllUsers = function (db, data) {
  if (db && data) {
    return db.ref("users").set(data);
  } else {
    return Promise.reject("missing required arguments");
  }
};

/**
 * Takes in a data object provided by DT and only returns an object
 * of the items we need in order to keep our DB small
 */
function refineUser(data) {
  return {
    props: data.props || 0,
    flow: data.flow || 0,
    DateAdded: data.DateAdded || new Date(),
    LastConnected: data.LastConnected || Date.now(),
    username: data.username || "404unknown",
    id: data.id,
    introduced: data.introduced || false,
    dubs: data.dubs || 0,
    logType: data.logType || "inserted",
  };
}

/**
 * Pretty self explanatory
 * @param {object}   db       Firebase Object
 * @param {object}   user     DT user object
 * @param {Promise} callback
 */
const insertUser = function (db, user, callback) {
  const usersRef = db.ref("users");
  const extraStuff = refineUser(user);
  const finalNewUser = Object.assign({}, user, extraStuff);

  Object.keys(finalNewUser).forEach(function (key) {
    if (finalNewUser[key] === void 0 /* aka undefined */) {
      finalNewUser[key] = null;
    }
  });
  return usersRef.child(user.id).set(finalNewUser, callback);
};

/**
 * Logs a user to the db
 * @param {object}   db       Firebase object
 * @param {object}   user     DT user object
 * @param {() => void} callback the Firebase User object
 */
const logUser = function (db, user, callback) {
  callback = callback || function () {};

  let lookup = db.ref("users").child(user.id);

  lookup
    .once("value")
    .then(function (snapshot) {
      const val = snapshot.val();

      if (!val) {
        let userLogInfo = refineUser(user);
        insertUser(db, userLogInfo, function (error) {
          if (error) {
            return log("error", "REPO", "logUser:" + user.id + " could not be saved");
          }
          user.logType = "inserted";
          return callback(user);
        });
      } else {
        let userLogInfo = refineUser(val);
        userLogInfo.username = user.username;
        updateUser(db, user.id, userLogInfo, function (error) {
          if (error) {
            return log("error", "REPO", "logUser:" + user.id + " could not be saved");
          }
          user.logType = "updated";
          return callback(user);
        });
      }
    })
    .catch(function (error) {
      log("error", "REPO", "logUser findUserById :" + error.code);
    });
};

/**
 * Increment by 1, a value of a user
 * @param {object}   db       Firebase Object
 * @param {object}   user
 * @param {string}   thing    The property to be incremented by
 * @param {()=>void} callback [description]
 */
const incrementUser = function (db, user, thing, callback) {
  const incUser = db.ref("users/" + user.id + "/" + thing);
  incUser.transaction(
    // increment prop by 1
    function (currentValue) {
      return (currentValue || 0) + 1;
    },
    // completion handler
    function (error) {
      if (error) {
        log("error", "REPO", "incrementUser:" + error);
        callback(null);
      } else {
        findUserById(db, user.id, function (foundUser) {
          return callback(foundUser);
        });
      }
    }
  );
};

/**
 * Pass through to incrementUser function for props
 */
const propsUser = function (db, user, callback) {
  incrementUser(db, user, "props", callback);
};

/**
 * Pass through to incrementUser function for hearts
 */
const heartsUser = function (db, user, callback) {
  incrementUser(db, user, "hearts", callback);
};

/**
 * Pass through to incrementUser function for flow
 */
const flowUser = function (db, user, callback) {
  incrementUser(db, user, "flow", callback);
};

/**
 * Sort by a specific user property and return array
 * @param {object}   db       Firebase database obj
 * @param {string}   prop     name of the property to sort by
 * @param {number}      limit
 * @param {() => void} callback
 */
const getLeaders = function (db, prop, limit, callback) {
  return db
    .ref("users")
    .orderByChild(prop)
    .limitToLast(limit)
    .once("value", function (snapshot) {
      callback(snapshot.val());
    });
};

/**
 * Get a trigger from the database
 * @param {object}   bot         dubapi instance
 * @param {object}   db          Firebase instance
 * @param {string}   triggerName trigger to look up
 * @param {()=>void} callback
 */
const getTrigger = function (bot, db, triggerName, callback) {
  db.ref("triggers")
    .orderByChild("Trigger")
    .equalTo(triggerName.toLowerCase() + ":")
    .once("value", function (snapshot) {
      const val = snapshot.val();
      if (typeof callback === "function") {
        return callback(val);
      }
    });
};

/**
 * @typedef {object} DataForUpdateTrigger
 * @property {string} triggerName
 * @property {string} triggerText
 * @property {object} user
 * @property {string} user.username
 */

/**
 * @typedef {object} Trigger
 * @property {string} Author
 * @property {string} Returns
 * @property {string} Trigger
 * @property {string | null} createdOn
 * @property {string | null} createdBy
 */

/**
 * Updates a trigger in the DB
 * @param {object} db   Firebase instance
 * @param {DataForUpdateTrigger} data Trigger data, see function for details, needs {Author, Returns, Trigger}
 * @param {Trigger} orignialValue  original value from firebase of trigger
 * @return {Firebase.Promise}
 */
const updateTrigger = function (db, data, triggerKey, orignialValue = {}) {
  if (!triggerKey || !data || !data.triggerText || !data.triggerName) {
    return;
  }

  const dbTrig = db.ref("triggers/" + triggerKey);

  const updateObj = {
    Author: data.user.username,
    Returns: data.triggerText || orignialValue.Returns,
    Trigger: data.triggerName.toLowerCase() + ":",
    status: "updated",
    lastUpdated: Date.now(),
    createdOn: orignialValue.createdOn || null,
    createdBy: orignialValue.createdBy || null,
  };

  // console.log(updateObj);

  db.ref("lastTrigger")
    .set(updateObj)
    .then(function (err) {
      if (err) {
        console.log("repo.lastTrigger.set", err);
      }
    });
  return dbTrig.set(updateObj);
};

/**
 * Insert a new trigger into the DB
 * @param {object} db   Firebase instance
 * @param {object} data Trigger data, see function for details, needs {Author, Returns, Trigger}
 * @return {Firebase.Promise}
 */
const insertTrigger = function (db, data) {
  if (!data || !data.triggerName || !data.triggerText) {
    return;
  }

  const author = _.get(data, "user.username", "unknown");

  let newTrigger = {
    Author: author,
    Returns: data.triggerText,
    Trigger: data.triggerName.toLowerCase() + ":",
    status: "created",
    lastUpdated: null,
    createdOn: Date.now(),
    createdBy: author,
  };

  db.ref("lastTrigger").set(newTrigger);
  return db.ref("triggers").push().set(newTrigger);
};

/**
 * Delete a trigger in the db
 * @param {object} db         Firebase Instance
 * @param {string} triggerKey The key of the location of the trigger
 * @return {Firebase.Promise}  Returns a promise
 */
const deleteTrigger = function (db, triggerKey, oldTrigger) {
  if (!triggerKey) {
    return;
  }

  oldTrigger.status = "deleted";
  db.ref("lastTrigger").set(oldTrigger);
  return db.ref("triggers/" + triggerKey).set(null);
};

/**
 * Inserts to trigger history
 * @param {object} db   Firebase instance
 * @param {object} data Trigger data returned from Firebase
 * @return {Firebase.Promise}
 */
const logTriggerHistory = function (db, msg, data) {
  if (!data || !data.triggerName || !data.triggerText) {
    return;
  }

  const author = _.get(data, "user.username", "unknown");

  return db.ref("triggerHistory").push().set({
    Author: author,
    Returns: data.Returns,
    Trigger: data.Trigger,
    status: data.status,
    lastUpdated: data.lastUpdated,
    createdOn: data.createdOn,
    createdBy: data.createdBy,
    msg: msg,
  });
};

/**
 * Pretty self explanatory
 * @param {object}   db       Firebase Object
 * @param {object}   media    DubApi's current media info object
 * @param {string | number} id     data.media.fkid
 * @param {string} reason      what the issue was
 * @param {() => void} callback
 */
const trackSongIssues = function (db, ytResponse, media, reason) {
  const songIssues = db.ref("/song_issues");

  ytResponse.reason = reason;
  ytResponse.date = new Date();
  ytResponse.timestamp = Date.now();

  const saveObj = Object.assign({}, ytResponse, media);

  songIssues.child(media.fkid).set(saveObj, function (err) {
    if (err) {
      log("error", "REPO", "trackSongIssues: Error saving for id " + media.fkid);
    }
  });
};

const getSongIssue = function (db, fkid) {
  return db.ref("song_issues").child(fkid).once("value");
};

const saveSong = function (db, fkid, saveObj) {
  const song_stats = db.ref("song_stats");
  song_stats.child(fkid).set(saveObj, function (err) {
    if (err) {
      log("error", "REPO", "song_stats: Error saving for id " + fkid);
    }
  });
};

const getSong = function (db, fkid) {
  return db.ref("song_stats").child(fkid).once("value");
};

/**
 * Insert leaderboard info for the month
 * @param {object}   db       Firebase Object
 * @param {string}   id       Leader id whic is a combination of month + year
 * @param {object}   leaderObj Leaderboard information
 */
const insertLeaderMonth = function (db, id, leaderObj) {
  return db.ref("leaderboard").child(id).set(leaderObj);
};

module.exports = {
  logUser: logUser,
  findUserById: findUserById,
  updateUser: updateUser,
  updateAllUsers: updateAllUsers,
  insertUser: insertUser,
  propsUser: propsUser,
  heartsUser: heartsUser,
  flowUser: flowUser,
  getLeaders: getLeaders,
  incrementUser: incrementUser,
  getTrigger: getTrigger,
  updateTrigger: updateTrigger,
  insertTrigger: insertTrigger,
  deleteTrigger: deleteTrigger,
  trackSongIssues: trackSongIssues,
  getSongIssue: getSongIssue,
  saveSong: saveSong,
  getSong: getSong,
  insertLeaderMonth: insertLeaderMonth,
  logTriggerHistory: logTriggerHistory,
};
