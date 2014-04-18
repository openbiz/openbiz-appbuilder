'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager'),
	moment = require('moment');

var builder = {
	_loadTemplates:function(loadPath,array){
		var files = fs.readdirSync(loadPath);
		for(var i in files){
			var templatePath = files[i];
			if(templatePath.indexOf(".")==0)continue;
			var name = (path.basename(templatePath,".").split("-"))[0];
			array[name]=_.template(fs.readFileSync(path.join(loadPath,templatePath), "UTF-8"));
		}
		return this;
	},
	buildFrontendViews:function(){	
		this._elementTemplates = [],this._actionTemplates = [];
		builder._loadTemplates(path.resolve(__dirname,"../../../templates/module/frontend/template/elements"),this._elementTemplates)
				._loadTemplates(path.resolve(__dirname,"../../../templates/module/frontend/template/actions"),this._actionTemplates);

        if(typeof this._config.views == 'undefined') return;
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
			if(fs.existsSync(file)  && !fm.isAllowedOverride(file) && this._config.options.override==false) {}else{
				var metadata = _.clone(viewConfig);
				delete metadata.functions;
				metadata.comment = "APPBUILDER_ALLOW_OVERRIDE = YES // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO";
				fs.writeFileSync(file, JSON.stringify( metadata, null,"  " ), 'utf-8');
				if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	
			}
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
			// action面板不需要在模板中预先渲染了
			// var actions = [];
			// for (var key in viewConfig.actions){
			// 	var action = viewConfig.actions[key];
			// 	if(typeof action.name=='undefined') continue;
			// 	action.selector = ".act-"+action.name.toLowerCase();
			// 	var classNameArray =  null;
			// 	if(action.hasOwnProperty('className')){
			// 		if(action.className.length > 0){
			// 			classNameArray = action.className.split(" ");
			// 		}
			// 	}
			// 	var className = "";
			// 	if(classNameArray != null){
			// 		className = "."+classNameArray.join(".");
			// 	}
			// 	action.className = className;
			// 	action.localeName = 'action'+action.name.charAt(0).toUpperCase() + action.name.slice(1);;
			// 	action.appName = this._config.app.name;
			// 	//这个是动态编译模板用的
			// 	if(typeof this._actionTemplates[action.type]=='function'){
			// 		actions.push(this._actionTemplates[action.type](action));
			// 	}
			// }
			
			for (var key in viewConfig.actions){
				if(typeof viewConfig.actions[key].name=='undefined') continue;
				viewConfig.actions[key].selector = ".act-"+viewConfig.actions[key].name.toLowerCase();
			}
			var actions = viewConfig.actions;
			
			// var formFields = [];
			// for (var key in viewConfig.fields){
			// 	var field = viewConfig.fields[key];
			// 	field.placeholderName = "placeholder"+field.name.charAt(0).toUpperCase() + field.name.slice(1);;
			// 	field.selector = "record-"+field.name.toLowerCase();				
			// 	field.showField = (viewConfig.type != 'addFormView');
			// 	field.momentDate = moment().format("YYYY-MM-DD");
			// 	field.fieldName = 'field'+field.name.charAt(0).toUpperCase() + field.name.slice(1);;
			// 	//这个是动态编译模板用的
			// 	if(typeof this._elementTemplates[field.type]=='function'){				
			// 		formFields.push(this._elementTemplates[field.type](field));
			// 	}
			// }	
			for (var key in viewConfig.fields){
				if(typeof viewConfig.fields[key].name=='undefined') continue;
				viewConfig.fields[key].selector = ".field-"+viewConfig.fields[key].name.toLowerCase();
			}
			var formFields = viewConfig.fields;		
						
			var data = {
				"APP_NAME" 		: this._config.app.name,
				"MODULE_NAME" 	: this._config.name,
				"VIEW_NAME"		: viewConfig.name,
				"MODEL_NAME"	: viewConfig.model,	
				"FUNCTIONS"		: viewConfig.functions?viewConfig.functions:[],
				"ACTIONS"       : actions,
				"BREADCRUMB"	: getBreadcrumb.call(this,viewConfig),
				"ELEMENTS"      : formFields,
				"SUBVIEWS"      : viewConfig.subviews,		
				"VIEW_TYPE"     : viewConfig.type,		
				"VIEW_EL"     	: ".nest-views ."+viewConfig.name,
			}
			switch(viewConfig.type){							
				case "addFormView":
				case "editFormView":
                case "detailFormView":
				case "editForm":
				case "detailForm":
				case "addForm":
					var viewTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/view/formView-template.js")
					var viewJadeTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/template/formView-template.jade")
					break;				
				case "nestAddFormView":
				case "nestEditFormView":
				case "nestDetailFormView":
					var viewTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/view/nestFormView-template.js")
					var viewJadeTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/template/nestFormView-template.jade")
					break;				
				case "nestPieChartView":
					var viewTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/view/nestPieChartView-template.js")
					var viewJadeTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/template/nestChartView-template.jade")
					break;	
				default:
					var viewTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/view/"+viewConfig.type+"-template.js")
					var viewJadeTemplateFile = path.resolve(__dirname,"../../../templates/module/frontend/template/"+viewConfig.type+"-template.jade")
					break;
			}
			var file = path.join(this._config.options.output,"ui","modules",this._config.name,"views",viewConfig.name+".js");
			if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false) {}else{
				var template = _.template(fs.readFileSync(viewTemplateFile,{encoding:'utf-8'}));
				fs.writeFileSync(file, template(data), 'utf-8');
				if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	
			}

			//build frontend view.jade
			var file = path.join(this._config.options.output,"ui","templates",this._config.name,viewConfig.name+".jade");
			if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false) {}else{
				var template = _.template(fs.readFileSync(viewJadeTemplateFile,{encoding:'utf-8'}));
				fs.writeFileSync(file, template(data), 'utf-8');
				if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	
			}

			//build frontend view.html
			var jade = require('jade');
			var fn = jade.compile( fs.readFileSync(file,{encoding:'utf-8'}) );
	    	var html = fn();
	    	var file = path.join(this._config.options.output,"ui","templates",this._config.name,viewConfig.name+".html");
	    	fs.writeFileSync(file, html	, 'utf-8');
	    	if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
		}
		return this;
	}	
}
module.exports= builder;