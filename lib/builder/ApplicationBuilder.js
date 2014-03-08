'use strict';

var fs = require("fs"),
	path = require("path");

module.exports = {
	_config:{},
	_defaultRoles:[],	
	build:function(config){
		this._config = config;
		if(!fs.existsSync(this._config.output)){			
			fs.mkdirSync(this._config.output);
		}		
		this._buildAppBackend()
			._buildAppFronted();
		return this;
	},
	_buildAppBackend:function(){
		var backendPath = path.join(this._config.output,'app');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.output,'app','modules');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.output,'app','policies');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}
		
		this._makePackageJSON()
			._makeRoles();

		//make index.js file
		var file = path.join(this._config.output,"index.js");
		fs.writeFileSync(file, fs.readFileSync(path.resolve(__dirname,"../../templates/application/index.js") ), 'utf-8');	

		//make app/index.js file
		var file = path.join(this._config.output,"app","index.js");
		fs.writeFileSync(file, fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/app/index.js")
					,{encoding:'utf-8'})
					.replace("[DEFAULT_ROLES]", JSON.stringify(this._defaultRoles,null,"  ")  ), 'utf-8');

		return this;
	},
	_buildAppFronted:function(){
		var backendPath = path.join(this._config.output,'ui');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		return this;
	},
	_makeRoles:function(){
		var backendRolesPath = path.join(this._config.output,'app','roles');
		if(!fs.existsSync(backendRolesPath)){			
			fs.mkdirSync(backendRolesPath);
		}

		var templateData = fs.readFileSync(path.resolve(__dirname,"../../templates/application/app/roles/role-template.js"),{encoding:'utf-8'});		
		for(var i=0; i< this._config.roles.length; i++){
			var role = this._config.roles[i];			
			var roleFile = path.join(backendRolesPath,role.name+'.js');
			if(typeof role.isDefault!='undefined' && role.isDefault == true)
			{
				this._defaultRoles.push(role.name);				
			}
			if(!fs.existsSync(roleFile)){	
				var roleData = templateData.replace("ROLE_DATA", JSON.stringify(role,null,"  ") );
				fs.writeFileSync(roleFile,roleData,'utf-8');
			}
		}


		return this;
	},
	_makePackageJSON:function(){
		var file = path.join(this._config.output,'package.json');
		if(fs.existsSync(file)){
			//console.log("The application's package.json is already exists -- skipped");
			return this;
		}

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