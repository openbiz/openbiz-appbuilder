'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../util/underscore');

module.exports = {
	_config:{},
	_defaultRoles:[],	
	_roleActions:[],
	build:function(config){
		this._config = config;
		if(!fs.existsSync(this._config.options.output)){			
			fs.mkdirSync(this._config.options.output);
		}		
		this._buildAppBackend()
			._buildAppFronted()
			._modifyServerMain()
			._modifyServerBootstrap()
			._processModules();
		return this;
	},
	_buildAppBackend:function(){
		var backendPath = path.join(this._config.options.output,'app');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.options.output,'app','modules');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.options.output,'app','policies');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}
		
		this._makePackageJSON()
			._makeRoles();

		//make index.js file
		var file = path.join(this._config.options.output,"index.js");
		if(fs.existsSync(file) && this._config.options.override==false) return this;
		fs.writeFileSync(file, fs.readFileSync(path.resolve(__dirname,"../../templates/application/index.js") ), 'utf-8');	

		//make app/index.js file
		var data = {
			"DEFAULT_ROLES" 	: JSON.stringify(this._defaultRoles,null,"  ")
		}
		var file = path.join(this._config.options.output,"app","index.js");
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/app/index.js")
					,{encoding:'utf-8'}));

		fs.writeFileSync(file, template(data), 'utf-8');	

		return this;
	},
	_buildAppFronted:function(){
		var backendPath = path.join(this._config.options.output,'ui');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		//create folders
		var backendPath = path.join(this._config.options.output,'ui','templates');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.options.output,'ui','templates','menu');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.options.output,'ui','menu');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.options.output,'ui','modules');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		this._makeLocales();

		this._makeMenu();

		//make ui/main.js file
		var data = {			
			"APP_NAME" 			: this._config.name			
		}

		var file = path.join(this._config.options.output,"ui","main.js");
		if(fs.existsSync(file) && this._config.options.override==false) return this;
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/ui/main.js")
					,{encoding:'utf-8'}));

		fs.writeFileSync(file, template(data), 'utf-8');		

		return this;
	},
	_modifyServerMain:function(){
		if(typeof this._config.options.appFile != 'undefined' && 
			this._config.options.appFile != null &&
			fs.existsSync(this._config.options.appFile)){

			var content = fs.readFileSync(this._config.options.appFile,{encoding:'utf-8'});

			if(this._config.options.output.indexOf(path.dirname(this._config.options.appFile))!=-1){
				var appPath = this._config.options.output.replace(path.dirname(this._config.options.appFile),"");		
				var deployCode = "//Auto generated app [ "+this._config.name+" ] mount point \n";
				deployCode += "require(.'"+ appPath +"')(openbiz)";
				if(appPath!="" && new content.indexOf(deployCode)==-1 && 
					(typeof this._config.deploy.backend!='undefined' || 
					 typeof this._config.deploy.frontend!='undefined')){
					 content += "\n"+deployCode+"";
					if(typeof this._config.deploy.backend!='undefined'){
						content += ".loadAppToRoute('"+this._config.deploy.backend+"')";
					}
					if(typeof this._config.deploy.frontend!='undefined'){
						content += ".loadUIToRoute('"+this._config.deploy.frontend+"')";
					}
					content+=";\n";
					fs.writeFileSync(this._config.options.appFile, content, 'utf-8');	
				}			
			}
		}
		return this;
	},
	_modifyServerBootstrap:function(){
		if(typeof this._config.options.appFile != 'undefined' && 
			this._config.options.appFile != null &&
			fs.existsSync(this._config.options.appFile) && 
			typeof this._config.deploy.bootstrapFile != 'undefined' && 
			this._config.deploy.bootstrapFile != null &&
			fs.existsSync(path.dirname(this._config.options.appFile)+this._config.deploy.bootstrapFile)){

			var replaceTag = "/*MORE_APPS*/";
			var file = path.dirname(this._config.options.appFile)+this._config.deploy.bootstrapFile;
			var content = fs.readFileSync(file,{encoding:'utf-8'});
			var appPath = this._config.options.output.replace(path.dirname(this._config.options.appFile),"");									
			
			if(appPath!="" && this._config.options.output.indexOf(appPath)!=-1 ){
				appPath = appPath.substring(1);			
				if(content.indexOf(appPath)==-1 ){					
					content = content.replace(replaceTag,",'"+appPath+"'"+replaceTag);
					fs.writeFileSync(file, content, 'utf-8');	
				}			
			}
		}
		return this;
	},
	_processModules:function(){		
		for(var i=0; i<this._config.modules.length; i++){
			var module = this._config.modules[i];
			
			var config = require(path.join(path.dirname(this._config.options.config),module));
			config.options = this._config.options;			
			require("./ModuleBuilder").build(config);
		}
		return this;
	},
	_makeMenu:function(){
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
						path.resolve(__dirname,"../../templates/application/ui/menu/menu-template.js")
						,{encoding:'utf-8'}));

			fs.writeFileSync(file, template(data), 'utf-8');
		}

		var file = path.join(this._config.options.output,"ui","templates","menu",this._config.name.toLowerCase()+"MenuView.jade");
		if(fs.existsSync(file) && this._config.options.override==false) return this;
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/ui/templates/menu/menu-template.jade")
					,{encoding:'utf-8'}));
		fs.writeFileSync(file, template(data), 'utf-8');

		var jade = require('jade');
		var fn = jade.compile(template(data));
    	var html = fn();
    	var file = path.join(this._config.options.output,"ui","templates","menu",this._config.name.toLowerCase()+"MenuView.html");
    	fs.writeFileSync(file, html	, 'utf-8');

	},
	_makeLocales:function(){
		var localePath = path.join(this._config.options.output,'ui','nls');
		if(!fs.existsSync(localePath)){			
			fs.mkdirSync(localePath);
		}

		var defaultLocale = {
		    'root': {
		        app:{
		            name:this._config.displayName,
		            description:this._config.description,
		            roles:{}
		        }        
		    }
		}

		for(var i=0;i<this._config.roles.length; i++)
		{
			defaultLocale.root.app.roles[this._config.roles[i].name]=this._config.roles[i].displayName;
		}

		for(var i=0;i<this._config.languages.length; i++)
		{
			var langName = this._config.languages[i];
			defaultLocale[langName]=true;
			var localeLangPath = path.join(this._config.options.output,'ui','nls',langName);
			if(!fs.existsSync(localeLangPath)){			
				fs.mkdirSync(localeLangPath);
			}
		

			var data = {
				"DEFAULT_LOCALE" 	: JSON.stringify(defaultLocale.root,null,"  ")
			}

			var file = path.join(localeLangPath,"locale.js");		
			if(fs.existsSync(file) && this._config.options.override==false){}else{
				var template = _.template(fs.readFileSync(
							path.resolve(__dirname,"../../templates/application/ui/nls/locale-template.js")
							,{encoding:'utf-8'}));
				fs.writeFileSync(file, template(data), 'utf-8');
			}
		}

		var data = {
			"DEFAULT_LOCALE" 	: JSON.stringify(defaultLocale,null,"  ")
		}

		var file = path.join(localePath,"locale.js");
		if(fs.existsSync(file) && this._config.options.override==false) return this;
		fs.writeFileSync(file, template(data), 'utf-8');

	},
	_makeRoles:function(){
		require('./module/RoleBuilder').buildBackendRoles.apply(this);
		return this;
	},
	_makePackageJSON:function(){
		var file = path.join(this._config.options.output,'package.json');		
		if(fs.existsSync(file) && this._config.options.override==false) return this;

		var template = require("../../templates/application/package");
		template.name 		 = this._config.name;
		template.description = this._config.description;
		template.version 	 = this._config.version;
		template.homepage 	 = this._config.homepage;
		template.license 	 = this._config.license;
		template.author 	 = this._config.author;

		var data = JSON.stringify(template,null,"  ");
		fs.writeFileSync(file, data, 'utf-8');
		return this;
	}
}