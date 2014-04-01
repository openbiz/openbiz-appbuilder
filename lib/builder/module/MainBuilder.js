'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager');

module.exports={
	buildFrontendMain:function(){
		var data = {			
			"APP_NAME" 			: this._config.name			
		}

		var file = path.join(this._config.options.output,"ui","main.js");
		if(fs.existsSync(file)  && !fm.isAllowedOverride(file)  && this._config.options.override==false) return this;
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../../templates/application/ui/main.js")
					,{encoding:'utf-8'}));

		fs.writeFileSync(file, template(data), 'utf-8');		
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");

		return this;
	},
	modifyFrontendMain:function()
	{
		var file = path.join(this._config.options.output,"ui","main.js");
		var content = fs.readFileSync(file,'utf-8');
		
		var modulePathReplaceTag = "/*MODULE_PATH_LIST*/";
		var moduleNameReplaceTag = "/*MODULE_NAME_LIST*/";
		var modulePairsReplaceTag = "/*MODULE_NAME_LIST_PAIRS*/";

		//for each frontend module folder
		var modulesFolder = path.join(this._config.options.output,"ui","modules");
		var folders = fs.readdirSync(modulesFolder);
		for(var i=0;i<folders.length;i++){			
			var folder = folders[i];
			if(!fs.lstatSync(this._config.options.output,"ui","modules",folder).isDirectory()) continue;	
			if(folder.indexOf(".")==0) continue;

			//process module path
			var modulePath = "./modules/"+folder+"/main";		
			if(content.indexOf(modulePath)!=-1) continue;
			content = content.replace(modulePathReplaceTag, ",'"+modulePath+"'\n\t"+modulePathReplaceTag);

			//process module name
			var moduleName = folder;	
			content = content.replace(moduleNameReplaceTag, ","+moduleName+"\n\t\t\t"+moduleNameReplaceTag);

			var modulePair = moduleName+": new "+moduleName+"()";
			if(i!=(folders.length-1)) modulePair +=","
			content = content.replace(modulePairsReplaceTag, modulePair+"\n\t\t\t\t"+modulePairsReplaceTag);

		}
		fs.writeFileSync(file, content, 'utf-8');		
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... modified");
		return this;
	}
}