'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore');

module.exports={
	buildBackendController:function(){
		for(var i =0 ; i<this._config.controllers.length; i++){			
			var modelConfig = this._config.controllers[i];
			
			//create folders
			var moduleModelsPath = path.join(this._config.output,"app","modules",this._config.name,"controllers");
			if(!fs.existsSync(moduleModelsPath)){			
				fs.mkdirSync(moduleModelsPath);
			}
			var data = {
				"MODEL_NAME" : modelConfig.model,
				"BASE_CONTROLLER": modelConfig.type,
				"ACTIONS" : modelConfig.actions
			}
			var file = path.join(this._config.output,"app","modules",this._config.name,"controllers",modelConfig.name+".js");
			if(fs.existsSync(file) && this._config.override==false) continue;
			var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/module/backend/controller/controller-template.js")
						,{encoding:'utf-8'}));
			fs.writeFileSync(file, template(data), 'utf-8');
		}
		return this;
	}
}