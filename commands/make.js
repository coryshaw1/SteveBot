var marked = require('marked');
var fs = require('fs');

require.extensions['.tmpl'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

require.extensions['.md'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var index = require('./index.tmpl');
var commands = require('./COMMANDS.md');

var converted = marked(commands);
var newIndex = index.replace("%%MARKDOWN%%", converted);

/* eslint no-console: 0 */
fs.writeFile("./index.html", newIndex, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
