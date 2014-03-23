'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore');

module.exports={
	buildFrontendMenu:function(){
		var data = {
			"APP_NAME_LOWERCASE": this._config.name.toLowerCase(),
			"APP_NAME" 			: this._config.name,
			"MENU_PERMISSION" 	: this._config.menu.permission,
			"MENU_ACL_LIST" 	: JSON.stringify(this._roleActions),
			"APP_DISPLAY_NAME"	: this._config.displayName
		}

		var file = path.join(this._config.options.output,"ui","menu","main.js");
		if(fs.existsSync(file) && this._config.options.override==false){

		}else{
			var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/application/ui/menu/menu-template.js")
						,{encoding:'utf-8'}));

			fs.writeFileSync(file, template(data), 'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	
		}

		var file = path.join(this._config.options.output,"ui","templates","menu",this._config.name.toLowerCase()+"MenuView.jade");
		if(fs.existsSync(file) && this._config.options.override==false) return this;
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../../templates/application/ui/templates/menu/menu-template.jade")
					,{encoding:'utf-8'}));
		fs.writeFileSync(file, template(data), 'utf-8');
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	

		var jade = require('jade');
		var fn = jade.compile(template(data));
    	var html = fn();
    	var file = path.join(this._config.options.output,"ui","templates","menu",this._config.name.toLowerCase()+"MenuView.html");
    	fs.writeFileSync(file, html	, 'utf-8');
    	if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	

		return this;
	},
	modifyFrontendMenu:function()
	{
		var file = path.join(this._config.options.output,"ui","main.js");
		var content = fs.readFileSync(file,'utf-8');

		return this;
	}
}