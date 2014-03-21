'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore');

module.exports={
	buildFrontendViews:function(){	
		for(var i =0 ; i<this._config.views.length; i++){			
			var viewConfig = this._config.views[i];

			//create folders
			var moduleViewsPath = path.join(this._config.output,"ui","modules",this._config.name,"views");
			if(!fs.existsSync(moduleViewsPath)){			
				fs.mkdirSync(moduleViewsPath);
			}
			var moduleTemplatesPath = path.join(this._config.output,"ui","templates",this._config.name);
			if(!fs.existsSync(moduleTemplatesPath)){			
				fs.mkdirSync(moduleTemplatesPath);
			}

			//build frontend view.json
			var file = path.join(this._config.output,"ui","modules",this._config.name,"views",viewConfig.name+".json");
			if(fs.existsSync(file) && this._config.override==false) continue;
			var metadata = _.clone(viewConfig);
			delete metadata.functions;
			fs.writeFileSync(file, JSON.stringify( metadata, null,"  " ), 'utf-8');

			//build frontend view.js

			//build frontend view.jade

			//build frontend view.html

		}


		return this;
	}
}