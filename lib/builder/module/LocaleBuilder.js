'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore');

module.exports={
	modifyLocale:function(){
		//load existing locale file
		var localeFile = path.join(this._config.output,"ui","nls","locale.js");

		// //generating model.json metadata file
		// var file = path.join(this._config.output,"app","modules",this._config.name,"models",modelConfig.name+".json");
		// if(fs.existsSync(file) && this._config.override==false) continue;
		// fs.writeFileSync(file, JSON.stringify( modelConfig.schema,null,"  " ), 'utf-8');

	
		return this;
	}
}