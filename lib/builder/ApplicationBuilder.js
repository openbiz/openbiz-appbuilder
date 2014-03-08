'use strict';

var fs = require("fs"),
	path = require("path");

module.exports = {
	_config:{},
	_defaultRoles:[],	
	_roleActions:[],
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
					.replace(/\[DEFAULT_ROLES\]/g, JSON.stringify(this._defaultRoles,null,"  ")  ), 'utf-8');

		return this;
	},
	_buildAppFronted:function(){
		var backendPath = path.join(this._config.output,'ui');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		//create folders
		var backendPath = path.join(this._config.output,'ui','templates');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.output,'ui','templates','menu');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.output,'ui','menu');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		var backendPath = path.join(this._config.output,'ui','modules');
		if(!fs.existsSync(backendPath)){			
			fs.mkdirSync(backendPath);
		}

		this._makeLocales();

		this._makeMenu();

		//make ui/main.js file
		var file = path.join(this._config.output,"ui","main.js");
		fs.writeFileSync(file, fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/ui/main.js")
					,{encoding:'utf-8'})
					.replace(/APP_NAME/g, this._config.name  ), 'utf-8');

		return this;
	},
	_makeMenu:function(){
		var file = path.join(this._config.output,"ui","menu","main.js");
		fs.writeFileSync(file, fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/ui/menu/menu-template.js")
					,{encoding:'utf-8'})
					.replace(/APP_NAME_LOWERCASE/g, this._config.name.toLowerCase() )
					.replace(/APP_NAME/g, this._config.name  )
					.replace(/MENU_PERMISSION/g, this._config.menu.permission  )					
					.replace(/\[MENU_ACL_LIST\]/g, JSON.stringify(this._roleActions) )
					, 'utf-8');

		var file = path.join(this._config.output,"ui","templates","menu",this._config.name.toLowerCase()+"MenuView.jade");
		var data = fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/ui/templates/menu/menu-template.jade")
					,{encoding:'utf-8'})					
					.replace(/APP_DISPLAY_NAME/g, this._config.displayName  )	;
		fs.writeFileSync(file, data	, 'utf-8');

		var jade = require('jade');
		var fn = jade.compile(data);
    	var html = fn();
    	var file = path.join(this._config.output,"ui","templates","menu",this._config.name.toLowerCase()+"MenuView.html");
    	fs.writeFileSync(file, html	, 'utf-8');

	},
	_makeLocales:function(){
		var localePath = path.join(this._config.output,'ui','nls');
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
			var localeLangPath = path.join(this._config.output,'ui','nls',langName);
			if(!fs.existsSync(localeLangPath)){			
				fs.mkdirSync(localeLangPath);
			}

		var file = path.join(localeLangPath,"locale.js");
		fs.writeFileSync(file, fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/ui/nls/locale-template.js")
					,{encoding:'utf-8'})
					.replace(/DEFAULT_LOCALE/g, JSON.stringify(defaultLocale.root,null,"  ")  ), 'utf-8');			
		}



		var file = path.join(localePath,"locale.js");
		fs.writeFileSync(file, fs.readFileSync(
					path.resolve(__dirname,"../../templates/application/ui/nls/locale-template.js")
					,{encoding:'utf-8'})
					.replace(/DEFAULT_LOCALE/g, JSON.stringify(defaultLocale,null,"  ")  ), 'utf-8');

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
				var roleData = templateData.replace(/ROLE_DATA/g, JSON.stringify(role,null,"  ") );
				fs.writeFileSync(roleFile,roleData,'utf-8');
			}
			for(var aclIndex=0;aclIndex<role.permissions.length;aclIndex++){
				if(this._roleActions.indexOf(role.permissions[aclIndex])==-1){
					this._roleActions.push( role.permissions[aclIndex] );
				}
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