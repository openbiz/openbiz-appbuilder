'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore');

module.exports={
	buildFrontendMain:function(){
		var data = {			
			"APP_NAME" 			: this._config.name			
		}

		var file = path.join(this._config.options.output,"ui","main.js");
		if(fs.existsSync(file) && this._config.options.override==false) return this;
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../../templates/application/ui/main.js")
					,{encoding:'utf-8'}));

		fs.writeFileSync(file, template(data), 'utf-8');		
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");

		return this;
	},
	modifyFrontendMain:function()
	{

	}
}