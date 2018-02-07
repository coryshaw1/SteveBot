'use strict';
const fs = require('fs');

/* eslint no-console: 0 */
/************************************************************************

Plan:
move "users" out of "dev" and place it at root
go through ALL the triggers and change their keys to be the Trigger instead

require:
make sure you update the dataFile location and name 

************************************************************************/

var dataFile = fs.readFileSync(process.cwd() + '/backup-1486435528386.json');

var data = JSON.parse(dataFile);

var newData = {
  triggers : {}
};

newData.users = data.dev.users;
newData.lastTrigger = data.lastTrigger; 
newData.leaderboard = data.leaderboard;
newData.song_issues = data.song_issues;
newData.song_stats = data.song_stats;

Object.keys(data.triggers).forEach((key)=>{
  var thisTrig = data.triggers[key];
  thisTrig.Trigger = thisTrig.Trigger.toLowerCase();
  newData.triggers[key] = thisTrig;
});

fs.writeFileSync(process.cwd() + '/restructured-data.json', JSON.stringify( newData ));
