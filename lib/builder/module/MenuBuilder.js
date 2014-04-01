'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager');

module.exports={
	buildFrontendMenu:function(){
		var data = {
			"APP_NAME_LOWERCASE": this._config.name.toLowerCase(),
			"APP_NAME" 			: this._config.name,
			"MENU_PERMISSION" 	: this._config.menu.permission,
			"MENU_ICON"			: this._config.menu.icon,
			"MENU_ACL_LIST" 	: JSON.stringify(this._roleActions),
			"APP_DISPLAY_NAME"	: this._config.displayName

		}

		var file = path.join(this._config.options.output,"ui","menu","main.js");
		if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false){

		}else{
			var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/application/ui/menu/menu-template.js")
						,{encoding:'utf-8'}));

			fs.writeFileSync(file, template(data), 'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	
		}

		var file = path.join(this._config.options.output,"ui","templates","menu",this._config.name.toLowerCase()+"MenuView.jade");
		if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false) return this;
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
		var file = path.join(this._config.options.output,"ui","templates","menu",path.basename(this._config.options.output).toLowerCase()+"MenuView.jade");
		var content = fs.readFileSync(file,'utf-8');
		if(!this._config.menus) this._config.menus=[];

		for(var i=0;i<this._config.menus.length;i++){
			var menu = this._config.menus[i];

			menu.localeKey = "menu"+menu.name.charAt(0).toUpperCase() + menu.name.slice(1);
			if(content.indexOf(menu.localeKey)!=-1) continue;

			menu.url = this._config.app.url+menu.url;
			menu.classNameString = menu.className.split(" ").join(".");
			if(menu.className) menu.classNameString="."+menu.classNameString;

			//Don't change below intends it has to match with the jade template intend
			content += "    li."+menu.permission+menu.classNameString+"\n      a(href='#!/backend"+menu.url+"')  <%= "+menu.localeKey+" %>\n";
		}
		
		fs.writeFileSync(file, content, 'utf-8');		
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... modified");


		var jade = require('jade');
		var fn = jade.compile(content);
    	var html = fn();
    	var file = path.join(this._config.options.output,"ui","templates","menu",path.basename(this._config.options.output).toLowerCase()+"MenuView.html");
    	fs.writeFileSync(file, html	, 'utf-8');
    	if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... modified");
		return this;
	}
}