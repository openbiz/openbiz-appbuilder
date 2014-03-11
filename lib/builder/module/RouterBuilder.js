'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore');

module.exports={
	buildBackendRouter:function(){
		var routes = {};
		for(var uri in this._config.routes){			
			var routeConfig = this._config.routes[uri];
			var middlewares = [];

			if(routeConfig.hasOwnProperty('permissions')){
				for(var i=0; i<routeConfig.permissions.length;i++){
					var middleware = "FUNC_START app.openbiz.ensurePermission('"+routeConfig.permissions[i]+"')"+" FUNC_END";
					middlewares.push(middleware);
				}
			}

			var actionTmp = routeConfig.action.split(".");
			var middleware = "FUNC_START app.getController('"+actionTmp[0]+"')."+actionTmp[1]+" FUNC_END";
			middlewares.push(middleware);

			var uriTmp = uri.split(" ");
			uri = uriTmp[0]+" /"+this._config.name+uriTmp[1];
			routes[uri] = middlewares;
		}

		var data = {
			"ROUTES":JSON.stringify( routes ,null ,"  " )
		}
		var file = path.join(this._config.output,"app","modules",this._config.name,"routes.js");				
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../../templates/module/backend/router/router-template.js")
					,{encoding:'utf-8'}));

		fs.writeFileSync(file, template(data)					
					.replace(/"FUNC_START/g,"")
					.replace(/FUNC_END"/g,"")
					, 'utf-8');		
		return this;
	}
}