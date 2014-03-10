'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../util/underscore');

module.exports={
	buildBackendModel:function(){
		for(var i =0 ; i<this._config.models.length; i++){			
			var modelConfig = this._config.models[i];
			if(modelConfig.hasOwnProperty('serverSide') && modelConfig.serverSide != true) continue; 

			//create folders
			var moduleModelsPath = path.join(this._config.output,"app","modules",this._config.name,"models");
			if(!fs.existsSync(moduleModelsPath)){			
				fs.mkdirSync(moduleModelsPath);
			}
			
			var file = path.join(this._config.output,"app","modules",this._config.name,"models",modelConfig.name+".js");
			fs.writeFileSync(file, fs.readFileSync(
						path.resolve(__dirname,"../../../templates/module/backend/model/model-template.js")
						,{encoding:'utf-8'})
						.replace(/@@APP_NAME@@/g, this._config.app  )
						.replace(/@@MODULE_NAME@@/g, this._config.name  )
						.replace(/@@MODEL_NAME@@/g, modelConfig.name  )
						.replace(/@@MODEL_SCHEMA@@/g, JSON.stringify( modelConfig.schema,null,"  " ) )
						.replace(/@@MODEL_COLLECTION@@/g, modelConfig.collection )
						, 'utf-8');
		}
		return this;
	},
	buildFrontendModel:function(){
		for(var i =0 ; i<this._config.models.length; i++){			
			var modelConfig = this._config.models[i];
			if(modelConfig.hasOwnProperty('clientSide') && modelConfig.clientSide != true) continue; 

			//create folders
			var moduleModelsPath = path.join(this._config.output,"ui","modules",this._config.name,"models");
			if(!fs.existsSync(moduleModelsPath)){			
				fs.mkdirSync(moduleModelsPath);
			}

			//make model item js file
			var file = path.join(this._config.output,"ui","modules",this._config.name,"models",modelConfig.name+".js");
			fs.writeFileSync(file, fs.readFileSync(
						path.resolve(__dirname,"../../../templates/module/frontend/model/backbone-item-template.js")
						,{encoding:'utf-8'})
						.replace(/@@APP_NAME@@/g, this._config.app  )
						.replace(/@@MODEL_RESOURCE_URI@@/g, modelConfig.resourceUri  )
						, 'utf-8');

			//make model collection js file
			var file = path.join(this._config.output,"ui","modules",this._config.name,"models",modelConfig.name+"Collection.js");
			fs.writeFileSync(file, fs.readFileSync(
						path.resolve(__dirname,"../../../templates/module/frontend/model/backbone-collection-template.js")
						,{encoding:'utf-8'})
						.replace(/@@APP_NAME@@/g, this._config.app  )
						.replace(/@@MODEL_RESOURCE_URI@@/g, modelConfig.resourceUri  )
						.replace(/@@MODEL_NAME@@/g, modelConfig.name)
						, 'utf-8');
		}
		return this;
	}
}