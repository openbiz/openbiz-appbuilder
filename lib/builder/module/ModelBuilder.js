'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore');

module.exports={
	buildBackendModel:function(){
		for(var i =0 ; i<this._config.models.length; i++){			
			var modelConfig = this._config.models[i];

			//create folders
			var moduleModelsPath = path.join(this._config.output,"app","modules",this._config.name,"models");
			if(!fs.existsSync(moduleModelsPath)){			
				fs.mkdirSync(moduleModelsPath);
			}
			var data = {
				"APP_NAME" 		: this._config.app,
				"MODULE_NAME" 	: this._config.name,
				"MODEL_NAME"	: modelConfig.name,				
				"MODEL_ACTION_STATICS" 	: modelConfig.action.statics,
				"MODEL_ACTION_METHODS" 	: modelConfig.action.methods,
				"MODEL_COLLECTION" : modelConfig.collection 
			}
			var file = path.join(this._config.output,"app","modules",this._config.name,"models",modelConfig.name+".json");
			if(fs.existsSync(file) && this._config.override==false) continue;
			fs.writeFileSync(file, JSON.stringify( modelConfig.schema,null,"  " ), 'utf-8');


			var file = path.join(this._config.output,"app","modules",this._config.name,"models",modelConfig.name+".js");
			if(fs.existsSync(file) && this._config.override==false) continue;
			var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/module/backend/model/model-template.js")
						,{encoding:'utf-8'}));
			fs.writeFileSync(file, template(data), 'utf-8');
		}
		return this;
	},
	buildFrontendModel:function(){
		for(var i =0 ; i<this._config.clientModels.length; i++){			
			var modelConfig = this._config.clientModels[i];
				
			
			//create folders
			var moduleModelsPath = path.join(this._config.output,"ui","modules",this._config.name,"models");
			if(!fs.existsSync(moduleModelsPath)){			
				fs.mkdirSync(moduleModelsPath);
			}

			if(modelConfig.hasOwnProperty('itemModel') && typeof modelConfig.itemModel.name != "undefined") 
			{		
				//make model item js file
				var data = {
					"APP_NAME" 		: this._config.app,
					"MODULE_NAME" 	: this._config.name,
					"MODEL_NAME"	: modelConfig.itemModel.name,
					"ACTIONS"		: modelConfig.itemModel.actions,
					"MODEL_RESOURCE_URI" 	: modelConfig.resourceUri,				
				}		
				var file = path.join(this._config.output,"ui","modules",this._config.name,"models",modelConfig.itemModel.name+".js");
				if(fs.existsSync(file) && this._config.override==false){
				}else{
					var template = _.template(fs.readFileSync(
								path.resolve(__dirname,"../../../templates/module/frontend/model/backbone-item-template.js")
								,{encoding:'utf-8'}));
					fs.writeFileSync(file, template(data), 'utf-8');
				}
			}

			if(modelConfig.hasOwnProperty('collectionModel') && typeof modelConfig.collectionModel.name != "undefined") {
				//make model collection js file
				//make model item js file
				var data = {
					"APP_NAME" 		: this._config.app,
					"MODULE_NAME" 	: this._config.name,
					"MODEL_NAME"	: modelConfig.collectionModel.name,
					"ACTIONS"		: modelConfig.collectionModel.actions,
					"MODEL_RESOURCE_URI" 	: modelConfig.resourceUri,				
				}	

				var file = path.join(this._config.output,"ui","modules",this._config.name,"models",modelConfig.collectionModel.name+".js");
				if(fs.existsSync(file) && this._config.override==false) continue;
				var template = _.template(fs.readFileSync(
							path.resolve(__dirname,"../../../templates/module/frontend/model/backbone-collection-template.js")
							,{encoding:'utf-8'}));
				fs.writeFileSync(file, template(data), 'utf-8');
			}
		}
		return this;
	}
}