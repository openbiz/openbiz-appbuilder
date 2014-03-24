'use strict';

// External lib.
var nopt = require('nopt'),
	path = require("path"),
	fs 	 = require("fs");
	
// CLI options we care about.
exports.known = {
	config: path, 
	output: path,
	appfile: path,
	force: Boolean,
	verbose: Boolean,
	help: Boolean,
	generate: path,
	type: ["app","module"]
};
exports.aliases = {
	c: '--config', 
	o: '--output',
	a: '--appfile',
	f: '--force',
	v: '--verbose',
	h: '--help',
	g: '--generate',
	t: '--type'
};

var helpInfo = "\n\
	   _/ ---------------------- \\_ \n\
	--==  Openbiz 4.0 Appbuilder  ==--\n\
	    \\ ---------------------- /\n\
\n\
It use for automatic generate application and modules for Openbiz Cubi Platform\n \
\n\
App Generation:\n\
\t-c  --config \tpath for Openbiz metadata config file\n \
\t-o  --output \tpath for generated openbiz app files\n \
\t-a  --appfile \tpath for express app.js entry point file if you want to auto deploy the generated files \n \
\t-f  --force \tforce to override generated files\n \
\t-v  --verbose \tverbose output\n \
\t-h  --help \tshow this help information\n \
\n\
Metadata Generation:\n \
\t-g  --generate \tgenerate sample metadata json\n \
\t-t  --type \tgenerate sample metadata type , app or module\n \
"

// Parse them and return an options object.
Object.defineProperty(exports, 'options', {
  get: function() {
    var options = nopt(exports.known, exports.aliases, process.argv, 2);
    options.override = options.force?options.force:false;
	options.verbose = options.verbose?options.verbose:false;

	options.generate = options.generate?options.generate:false;
	options.type = options.type?options.type:'module';
	options.appFile = options.appfile;

	if(options.help){
		console.log(helpInfo);	
		return null;
	}else if(options.generate==false){
    	if(typeof options.config=='undefined' || !fs.existsSync(options.config)){
			console.log("please specify a config file by using --config [path] or --help for more helps");	
			return null;
		}    	
	}
	return options;
  }
});