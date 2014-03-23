'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore');

module.exports={
	buildFrontendViews:function(){	
		for(var i =0 ; i<this._config.views.length; i++){			
			var viewConfig = this._config.views[i];

			//create folders
			var moduleViewsPath = path.join(this._config.options.output,"ui","modules",this._config.name,"views");
			if(!fs.existsSync(moduleViewsPath)){			
				fs.mkdirSync(moduleViewsPath);
			}
			var moduleTemplatesPath = path.join(this._config.options.output,"ui","templates",this._config.name);
			if(!fs.existsSync(moduleTemplatesPath)){			
				fs.mkdirSync(moduleTemplatesPath);
			}

			//build frontend view.json
			var file = path.join(this._config.options.output,"ui","modules",this._config.name,"views",viewConfig.name+".json");
			if(fs.existsSync(file) && this._config.options.override==false) continue;
			var metadata = _.clone(viewConfig);
			delete metadata.functions;
			fs.writeFileSync(file, JSON.stringify( metadata, null,"  " ), 'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	

			//build frontend view.js
			var getBreadcrumb=function(viewConfig){
				var breadcrumbArray = [];
				breadcrumbArray.push({
					name:'home',
					displayName:'Home',
					url:'#'
				});
				breadcrumbArray.push({
					name:this._config.app.name,
					displayName:this._config.app.displayName,
					url:'#'+this._config.app.url
				});
				breadcrumbArray.push({
					name:viewConfig.name,
					displayName:viewConfig.displayName,			
				});				
				return breadcrumbArray;
			}
			var actions = [];
			for (var key in viewConfig.actions){
				var action = viewConfig.actions[key];
				action.selector = ".act-"+action.name.toLowerCase();
				var classNameArray =  null;
				if(action.hasOwnProperty('className')){
					if(action.className.length > 0){
						classNameArray = action.className.split(" ");
					}
				}
				var className = "";
				if(classNameArray != null){
					className = "."+classNameArray.join(".");
				}
				action.className = className;
				action.localeName = 'action'+action.name.charAt(0).toUpperCase() + action.name.slice(1);;
				actions.push(action);
			}
			var formFields = [];
			for (var key in viewConfig.fields){
				var field = viewConfig.fields[key];
				field.selector = "record-"+action.name.toLowerCase();
				formFields.push(field);
			}
			var data = {
				"APP_NAME" 		: this._config.app.name,
				"MODULE_NAME" 	: this._config.name,
				"VIEW_NAME"		: viewConfig.name,
				"MODEL_NAME"	: viewConfig.model,	
				"FUNCTIONS"		: viewConfig.functions?viewConfig.functions:[],
				"ACTIONS"       : actions,
				"BREADCRUMB"	: getBreadcrumb.call(this,viewConfig),
				"FORM_FIELDS"   : formFields
			}
			switch(viewConfig.type){
				case "gridView":
					var viewTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/view/gridView-template.js")
					var viewJadeTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/template/gridView-template.jade")
					break;
				default:
					var viewTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/view/gridView-template.js")
					var viewJadeTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/template/gridView-template.jade")
					break;
			}
			var file = path.join(this._config.options.output,"ui","modules",this._config.name,"views",viewConfig.name+".js");
			if(fs.existsSync(file) && this._config.options.override==false) continue;
			var template = _.template(fs.readFileSync(viewTemplateFile,{encoding:'utf-8'}));
			fs.writeFileSync(file, template(data), 'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	

			//build frontend view.jade
			var file = path.join(this._config.options.output,"ui","templates",this._config.name,viewConfig.name+".jade");
			if(fs.existsSync(file) && this._config.options.override==false) continue;
			var template = _.template(fs.readFileSync(viewJadeTemplateFile,{encoding:'utf-8'}));
			fs.writeFileSync(file, template(data), 'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	

			//build frontend view.html
			var jade = require('jade');
			var fn = jade.compile(template(data));
	    	var html = fn();
	    	var file = path.join(this._config.options.output,"ui","templates",this._config.name,viewConfig.name+".html");
	    	fs.writeFileSync(file, html	, 'utf-8');
	    	if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	
		}
		return this;
	}	
}