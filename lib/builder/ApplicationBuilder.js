'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../util/underscore'),
	fm = require('../util/fileManager');

module.exports = {
	_config:{},
	_defaultRoles:[],	
	_roleActions:[],
	build:function(config){		
		this._config = config;
		if(!fs.existsSync(this._config.options.output)){			
			fs.mkdirSync(this._config.options.output);
		}		
		if(this._config.options.verbose) console.log(" ");
		this._buildAppBackend()
			._buildAppFronted()
			._modifyServerMain()
			._modifyServerBootstrap()
			._processModules();
		return this;
	},
	_buildAppBackend:function(){
		if(this._config.options.verbose) console.log("Generate App Backend files");
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
		
		require('./module/RoleBuilder').buildBackendRoles.apply(this);

		this._makePackageJSON();

		//make index.js file		
		var file = path.join(this._config.options.output,"index.js");
		if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false){if(this._config.options.verbose) console.log(" "); return this;		}
		fs.writeFileSync(file, fs.readFileSync(path.resolve(__dirname,"../../templates/application/index.js") ), 'utf-8');	
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");

		//make app/index.js file
		var data = {
			"DEFAULT_ROLES" 	: JSON.stringify(this._defaultRoles,null,"  ")
		}
		var file = path.join(this._config.options.output,"app","index.js");
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/app/index.js")
					,{encoding:'utf-8'}));

		fs.writeFileSync(file, template(data), 'utf-8');	
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");

		if(this._config.options.verbose) console.log(" ");
		return this;
	},
	_buildAppFronted:function(){
		if(this._config.options.verbose) console.log("Generate App Frontend files");
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

		require('./module/MenuBuilder').buildFrontendMenu.apply(this);
		require('./module/LocaleBuilder').buildFrontendLocale.apply(this);
		require('./module/MainBuilder').buildFrontendMain.apply(this);

		return this;
	},
	_modifyServerMain:function(){
		if(typeof this._config.options.appFile != 'undefined' && 
			this._config.options.appFile != null &&
			fs.existsSync(this._config.options.appFile)){
			var file = this._config.options.appFile;
			var content = fs.readFileSync(file,{encoding:'utf-8'});

			if(this._config.options.output.indexOf(path.dirname(this._config.options.appFile))!=-1){
				var appPath = this._config.options.output.replace(path.dirname(this._config.options.appFile),"");		
				var deployCode = "//Auto generated app [ "+this._config.name+" ] mount point \n";
				deployCode += "require('."+ appPath +"')(openbiz)";
				if(appPath!="" &&  content.indexOf(deployCode)==-1 && 
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
					fs.writeFileSync(file, content, 'utf-8');	
					if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... modified");
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
				if(content.indexOf("'"+appPath+"'")==-1 ){		
					content = content.replace(replaceTag,",'"+appPath+"'"+replaceTag);
					fs.writeFileSync(file, content, 'utf-8');
					if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... modified");	
				}			
			}
		}
		return this;
	},
	_processModules:function(){		
		if(this._config.options.verbose) console.log(" ");	
		if(this._config.options.verbose) console.log("Process App modules \n ");	
		for(var i=0; i<this._config.modules.length; i++){
			var module = this._config.modules[i];		
			var config = require(path.join(path.dirname(this._config.options.config),module));
			config.options = this._config.options;					
			require("./ModuleBuilder").build(config);
			if(this._config.options.verbose) console.log(" ");
		}
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
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
		return this;
	}
}