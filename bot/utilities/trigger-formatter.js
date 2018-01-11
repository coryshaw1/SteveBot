/**
 * This formats a Trigger text with dynamic replacements 
 */

'use strict';
function getTokens(str) {
  var found = [];

  var openToken = false;
  var storage = '';
  
  str.split('').forEach(function(char){
    if (char === "%" && !openToken) { 
      openToken = true;
      storage = "%";
      return;
    }
    if (char === "%" && openToken) { 
      openToken = false;
      storage += "%";
      found.push(storage);
      return;
    }
    if (openToken) { 
      storage += char;
    }
  });
  
  return found;
}

function regEsc(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function handleNumbered(text, c, bot, data) {
  let params = data.params || [];

  // if only %n%, then replace
  if (/^%[0-9]+%$/.test(c)) {
    let num = parseInt( c.replace("%",'') ,10);
    let item = new RegExp(regEsc(c), 'g');
    if (params[num]) {
      text = text.replace(item, params[num]);
    }
  }

  // now handle default params
  if (/^%[0-9]+\|/.test(c)) {
    let parts = c.replace(/%/g,'').split("|");
    
    let dflt = parts[1];
    let num = parseInt( parts[0] ,10);

    let item = new RegExp(regEsc(c), 'g');
    if (dflt === "me") {
      dflt = data.user.username;
    }
    if (dflt === "dj") {
      dflt = bot.getDJ().username;
    }
    text = text.replace(item, params[num] || dflt);
  }

  return text;
}

module.exports = function triggerFormatter(text, bot, data){
  var tokens = getTokens(text);
  console.log(tokens);

  tokens.forEach(function(c){
    if (c === '%dj%'){
      // replace with current DJ name
      text = text.replace('%dj%', '@' + bot.getDJ().username);
    }
    if (c === '%me%'){
      // replace with user who entered chat name
      text = text.replace('%me%', data.user.username);
    }

    // if it's a numbered one
    if (/%[0-9]/.test(c)) {
      text = handleNumbered(text, c, bot, data);
    }

  });

  return text;
};