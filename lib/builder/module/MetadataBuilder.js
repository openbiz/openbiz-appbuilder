'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager');

module.exports={
	buildAppMetadata:function(){
		if(this._config.verbose) console.log("Generate Openbiz application metadata file");
		if((path.basename(this._config.generate).split(".")).length==1){
			this._config.generate+=".json";
		}
		var metaName = (path.basename(this._config.generate).split("."))[0];
		var data = {
			'name': metaName,
			'displayName':metaName.charAt(0).toUpperCase() + metaName.slice(1)
		}
		var file = path.resolve(this._config.generate);		
		var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/metadata/app-template.json")
						,{encoding:'utf-8'}));	
		fs.writeFileSync(file, template(data), 'utf-8');
		if(this._config.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.generate),"")+" ...... created");	
		return this;
	},
	buildModuleMetadata:function()
	{
		if(this._config.verbose) console.log("Generate Openbiz module metadata file");
		if((path.basename(this._config.generate).split(".")).length==1){
			this._config.generate+=".json";
		}
		var metaName = (path.basename(this._config.generate).split("."))[0];
		var data = {
			'name': metaName,
			'displayName':metaName.charAt(0).toUpperCase() + metaName.slice(1)
		}
		var file = path.resolve(this._config.generate);		
		var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/metadata/module-template.json")
						,{encoding:'utf-8'}));	
		fs.writeFileSync(file, template(data), 'utf-8');
		if(this._config.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.generate),"")+" ...... created");	
		return this;
	}
}