'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager');

module.exports={
	buildBackendRoles:function(){
		var backendRolesPath = path.join(this._config.options.output,'app','roles');
		if(!fs.existsSync(backendRolesPath)){			
			fs.mkdirSync(backendRolesPath);
		}

		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../../templates/application/app/roles/role-template.js")
					,{encoding:'utf-8'}));
        if(typeof this._config.roles == 'undefined') return;
		for(var i=0; i< this._config.roles.length; i++){
			var role = this._config.roles[i];
			var file = path.join(backendRolesPath,role.name+'.js');
			if(typeof role.isDefault!='undefined' && role.isDefault == true)
			{
				this._defaultRoles.push(role.name);				
			}
			var data = {
				"ROLE_DATA" 	: JSON.stringify(role,null,"  ")
			}
			if(fs.existsSync(file)  && !fm.isAllowedOverride(file) && this._config.options.override==false) continue;
 			fs.writeFileSync(file,template(data),'utf-8');
			if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");

			for(var aclIndex=0;aclIndex<role.permissions.length;aclIndex++){
				if(this._roleActions.indexOf(role.permissions[aclIndex])==-1){
					this._roleActions.push( role.permissions[aclIndex] );
				}
			}			
		}


		return this;
	},
}