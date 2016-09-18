
function findTrigger(bot, db, data, callback) {
  var trig = db.ref("triggers").orderByChild("Trigger").equalTo(data.trigger + ":").once("value", function(snapshot) {
      var val = snapshot.val();
      var keys = Object.keys(val);

      var theReturn = val[keys[0]].Returns;
      
      if (theReturn.indexOf("%dj%") >= 0){
        // replace with current DJ name
        theReturn = theReturn.replace("%dj%", "@" + bot.getDJ().username);
      }
      if (theReturn.indexOf("%me%") >= 0) {
        // replace with user who entered chat name
        theReturn = theReturn.replace("%me%", data.user.username);
      }

      if (typeof callback === "function") {
        callback(theReturn);
      }
  });
}

module.exports = findTrigger;