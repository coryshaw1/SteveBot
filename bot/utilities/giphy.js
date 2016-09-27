'use strict';
// modified from this source: https://github.com/ShMcK/API-Demos/tree/master/demo-ng/packages/giphy
var request = require('request');

var ROOT_API = 'http://api.giphy.com/v1/gifs/';

var Giphy = {};

var defaults = {
  API_KEY: 'dc6zaTOxFJmzC',
  size: 'original', // {string} [fixed, downsized, original]
  limit: 15,
  rating: 'pg-13', // {string} [y, g, pg, pg-13, r]
  random : true
};

Giphy.options = Object.assign({}, defaults);

var getRandom = function (list) {
  return list[Math.floor((Math.random()*list.length))];
};

var reformatRandomImage = function(data) {
  switch (Giphy.options.size) {
    case 'original':
      return data.image_original_url;
      break;
    case 'downsized':
      return data.fixed_height_small_url;
      break;
    case 'fixed':
      return data.fixed_height_downsampled_url;
      break;
    default:
      throw new Error('Not a valid option size for images');
  }
};

var buildAPI = function(query){
  var apiPath = ROOT_API;

  if (Giphy.options.random) {
    apiPath += 'random'
    apiPath += '?tag=' + query.replace(/ /g, "+");
  } else {
    apiPath += 'search'
    apiPath += '?q=' + query.replace(/ /g, "+");
    apiPath += '&limit=' + Giphy.options.limit;
  }
  apiPath += '&fmt=json';
  apiPath += '&rating=' + Giphy.options.rating;
  apiPath += '&api_key=' + Giphy.options.API_KEY;
  return apiPath;
};

function APICall(query, callback) {
  var apiPath = buildAPI(query);

  return request.get(apiPath, function (error, response, body) {
    if (error) {
      console.error('Error fetching result from Giphy');
      callback( error, null );
      return;
    } 
    
    if (!error && response.statusCode === 200) {
      var result = JSON.parse(body);
      if (!Giphy.options.random) {
        callback(null, getRandom(result.data).images[Giphy.options.size] );
      } else {
        callback(null, reformatRandomImage(result.data) );
      }
    }
  });
}

/*
  random:  bool
  rating : {string} [y, g, pg, pg-13, r]
  limit : number
  size : {string} [fixed, downsized, original] 
 */

var getGif = function(options, query, callback){
  if (typeof callback !== 'function') {
    return; // what's the point if we're not going to do anything with it
  }

  if (options && typeof options === 'object') {
    Giphy.options = Object.assign({}, Giphy.options, options);
  }

  APICall(query, callback);
}

module.exports = {
 getGif : getGif,
 getRandom : getRandom
};