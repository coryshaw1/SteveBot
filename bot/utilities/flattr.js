'use strict';
var repo = require(process.cwd()+'/repo');
var settings = require(process.cwd() + '/private/settings.js');
var usersInfo = require(process.cwd()+'/bot/utilities/users');
var _ = require('underscore');


/*
http://developers.flattr.net/api/

  1. get code using client id and scopes
  2. get access token using code, client id, and client secret
 */