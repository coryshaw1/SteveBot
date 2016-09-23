'use strict';

var request = require('request');

/***************************************************
  Get a random gif from Giphy
  
  https://github.com/Giphy/GiphyAPI#random-endpoint
  http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=american+psycho
*/

// this key is NOT SECRET and not mine, got it directly from their public docs
var giphyKey = 'dc6zaTOxFJmzC';
var rating = 'pg-13';
var baseGiphyUrl = `http://api.giphy.com/v1/gifs/search`;

function makeReq(search) {
  var t = search || ''; 
  return `${baseGiphyUrl}?api_key=${giphyKey}&q=${t}$rating=${rating}`;
}

var getRandom = function (list) {
  return list[Math.floor((Math.random()*list.length))];
};


module.exports = function(bot, db, data) {
  if (!data) {
    bot.log('error', 'BOT', '[GIPHY] ERROR [Missing data]');
    return bot.sendChat('An error occured, try again');
  }

  if (data.params.length === 0) {
    return bot.sendChat('*usage:* !giphy <search text>');
  }
  
  var tag = data.triggerText = data.params.join('+');

  request(makeReq(tag), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(body);
      bot.sendChat( getRandom(json.data).images.fixed_height.url );
    } else {
      bot.sendChat('Bad request to giphy...');
    }
  });
};