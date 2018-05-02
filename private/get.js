'use strict';
/** 
 * Return the proper private items based on environment variables
*/
module.exports = {
  settings : require( process.cwd() + `/private/${process.env.ENV||'prod'}/settings.js`),
  svcAcct : require(process.cwd() + `/private/${process.env.ENV||'prod'}/serviceAccountCredentials.json`)
};

