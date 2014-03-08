'use strict';

// External lib.
var nopt = require('nopt'),
	path = require("path")
	
// CLI options we care about.
exports.known = {
	config: path, 
	output: path
};
exports.aliases = {
	c: '--config', 
	o: '--output'
};

// Parse them and return an options object.
Object.defineProperty(exports, 'options', {
  get: function() {
    return nopt(exports.known, exports.aliases, process.argv, 2);
  }
});