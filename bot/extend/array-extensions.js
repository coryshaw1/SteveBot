
if (!Array.prototype.random) {
  Array.prototype.random = function() {
    let i = Math.floor( ( Math.random()*this.length ) );
    return this[i];
  };
}

module.exports = function() {};