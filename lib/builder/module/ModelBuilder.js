'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager');

module.exports={
	buildBackendModel:function(){
        if(typeof this._config.models == 'undefined') return;
		for(var i =0 ; i<this._config.models.length; i++){			
			var modelConfig = this._config.models[i];

			//create folders
			var moduleModelsPath = path.join(this._config.options.output,"app","modules",this._config.name,"models");
			if(!fs.existsSync(moduleModelsPath)){			
				fs.mkdirSync(moduleModelsPath);
			}
			var features = modelConfig.features?_.clone(modelConfig.features):{};
			var defaults = modelConfig.features?_.clone(modelConfig.features.defaults):{};
			delete features.defaults;
			features = JSON.stringify(features,null,"      ");
			defaults = JSON.stringify(defaults,null,"      ");
			var data = {
				"APP_NAME" 		: this._config.app.name,
				"MODULE_NAME" 	: this._config.name,
				"MODEL_NAME"	: modelConfig.name,				
				"MODEL_FEATURES": features,	
				"MODEL_META_DEFAULTS": defaults,
				"MODEL_ACTION_STATICS" 	: modelConfig.functions.statics,
				"MODEL_ACTION_METHODS" 	: modelConfig.functions.methods,
				"MODEL_COLLECTION" : modelConfig.collection,
				"MODEL_ENABLE_METADATA": modelConfig.features.enableMetadata?modelConfig.features.enableMetadata:false				
			}
			//generating model.js
			var file = path.join(this._config.options.output,"app","modules",this._config.name,"models",modelConfig.name+".js");
			if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false) continue;
			var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/module/backend/model/model-template.js")
						,{encoding:'utf-8'}));
			fs.writeFileSync(file, template(data), 'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");

			//generating model.json metadata file
			var file = path.join(this._config.options.output,"app","modules",this._config.name,"models",modelConfig.name+".json");
			if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false) continue;
			var metadata = {
				"schema" : modelConfig.schema,
				"comment" : "APPBUILDER_ALLOW_OVERRIDE = YES // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO"
			}
			fs.writeFileSync(file, JSON.stringify( metadata,null,"  " ), 'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
		}
		return this;
	},
	buildFrontendModel:function(){
        if(typeof this._config.clientModels == 'undefined') return;
		for(var i =0 ; i<this._config.clientModels.length; i++){			
			var modelConfig = this._config.clientModels[i];
				
			
			//create folders
			var moduleModelsPath = path.join(this._config.options.output,"ui","modules",this._config.name,"models");
			if(!fs.existsSync(moduleModelsPath)){			
				fs.mkdirSync(moduleModelsPath);
			}

			if(modelConfig.hasOwnProperty('itemModel') && typeof modelConfig.itemModel.name != "undefined") 
			{		
				//make model item js file
				var data = {
					"APP_NAME" 		: this._config.app.name,
					"MODULE_NAME" 	: this._config.name,
					"MODEL_NAME"	: modelConfig.itemModel.name,
					"FUNCTIONS"		: modelConfig.itemModel.functions?modelConfig.itemModel.functions:[],
					"MODEL_RESOURCE_URI" 	: modelConfig.resourceUri,				
				}		
				var file = path.join(this._config.options.output,"ui","modules",this._config.name,"models",modelConfig.itemModel.name+".js");
				if(fs.existsSync(file) && this._config.options.override==false){
				}else{
					var template = _.template(fs.readFileSync(
								path.resolve(__dirname,"../../../templates/module/frontend/model/backbone-item-template.js")
								,{encoding:'utf-8'}));
					fs.writeFileSync(file, template(data), 'utf-8');
					if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
				}
			}

			if(modelConfig.hasOwnProperty('collectionModel') && typeof modelConfig.collectionModel.name != "undefined") {
				//make model collection js file
				//make model item js file
				var data = {
					"APP_NAME" 		: this._config.app.name,
					"MODULE_NAME" 	: this._config.name,
					"MODEL_NAME"	: modelConfig.itemModel.name,
					"FUNCTIONS"		: modelConfig.itemModel.functions?modelConfig.itemModel.functions:[],
					"MODEL_RESOURCE_URI" 	: modelConfig.resourceUri
				}
				var file = path.join(this._config.options.output,"ui","modules",this._config.name,"models",modelConfig.collectionModel.name+".js");
				if(fs.existsSync(file) && this._config.options.override==false) continue;
				var template = _.template(fs.readFileSync(
							path.resolve(__dirname,"../../../templates/module/frontend/model/backbone-collection-template.js")
							,{encoding:'utf-8'}));
				fs.writeFileSync(file, template(data), 'utf-8');
				if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
			}
		}
		return this;
	}
}