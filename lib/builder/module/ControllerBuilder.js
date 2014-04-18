'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager');

module.exports={
	buildBackendController:function(){
        if(typeof this._config.controllers == 'undefined') return;
		for(var i =0 ; i<this._config.controllers.length; i++){			
			var modelConfig = this._config.controllers[i];
			
			//create folders
			var moduleModelsPath = path.join(this._config.options.output,"app","modules",this._config.name,"controllers");
			if(!fs.existsSync(moduleModelsPath)){			
				fs.mkdirSync(moduleModelsPath);
			}
			var data = {
				"MODEL_NAME" : modelConfig.model,
				"MODEL_PATH" : modelConfig.path,
				"BASE_CONTROLLER": modelConfig.type,
				"FUNCTIONS" : modelConfig.functions
			}
			var file = path.join(this._config.options.output,"app","modules",this._config.name,"controllers",modelConfig.name+".js");
			if(fs.existsSync(file) && !fm.isAllowedOverride(file) && this._config.options.override==false) continue;
			var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/module/backend/controller/controller-template.js")
						,{encoding:'utf-8'}));
			fs.writeFileSync(file, template(data), 'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
		}
		return this;
	}
}