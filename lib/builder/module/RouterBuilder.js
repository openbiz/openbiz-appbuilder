'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager');

module.exports={
	buildBackendRouter:function(){
		var routes = {};
		for(var uri in this._config.routes){			
			var routeConfig = this._config.routes[uri];
			var middlewares = [];
			var uriTmp = uri.split(" ");
			var actionTmp = routeConfig.action.split(".");

			uri = uriTmp[0]+" "+uriTmp[1];

			// ensureDataACLPermission middleware
			var ensureDataACLPermission = function(){
				if(uri.slice(0,3) == "get"){
					var middleware = "FUNC_START app.openbiz.ensureDataACLPermission('ACCESS')"+" FUNC_END";
					middlewares.push(middleware);
				}else{
					var middleware = "FUNC_START app.openbiz.ensureDataACLPermission('MANAGE')"+" FUNC_END";
					middlewares.push(middleware);
				}
			}

			// ensurePermission middleware
			if(routeConfig.hasOwnProperty('permissions')){
				for(var i=0; i<routeConfig.permissions.length;i++){
					var middleware = "FUNC_START app.openbiz.ensurePermission('"+routeConfig.permissions[i]+"')"+" FUNC_END";
					middlewares.push(middleware);
				}
			}

			// ensureExists middleware
			if(uriTmp[1].indexOf("/:id")!=-1){
				var ensureExists = "FUNC_START app.getController('"+actionTmp[0]+"').ensureExists FUNC_END";
				middlewares.push(ensureExists);
				ensureDataACLPermission();
			}

			var middleware = "FUNC_START app.getController('"+actionTmp[0]+"')."+actionTmp[1]+" FUNC_END";
			middlewares.push(middleware);

			routes[uri] = middlewares;
		}

		var data = {
			"ROUTES":JSON.stringify( routes ,null ,"  " )
		}
		var file = path.join(this._config.options.output,"app","modules",this._config.name,"routes.js");				
		if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false) return this;
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../../templates/module/backend/router/router-template.js")
					,{encoding:'utf-8'}));

		fs.writeFileSync(file, template(data)					
					.replace(/"FUNC_START/g,"")
					.replace(/FUNC_END"/g,"")
					, 'utf-8');	
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");	
		return this;
	},
	buildFrontendRouter:function(){
		var file = path.join(this._config.options.output,"ui","modules",this._config.name,"router.js");
		if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false) return this;
		var data = {
			APP_NAME : this._config.app.name,
			APP_URL : this._config.app.url,
			MODULE_NAME: this._config.name,
			ROUTES:[]
		};
        if(typeof this._config.views == 'undefined'){}else{
            for(var i=0;i<this._config.views.length;i++){
                if(typeof this._config.views[i].url!='undefined'){
                    var PARAMETERS = "";
                    var tmp = this._config.views[i].url.match(/(\(\?)?:\w+/g);
                    if(tmp !=null){
                        PARAMETERS = tmp.join(",").replace(/:/g,"");
                    }

                    var route = {
                        URL:  this._config.views[i].url,
                        VIEW_NAME: this._config.views[i].name,
                        FUNCTION: "show"+this._config.views[i].name.charAt(0).toUpperCase()+this._config.views[i].name.slice(1),
                        PARAMETERS: PARAMETERS
                    }
                    data.ROUTES.push(route);
                }
            }
        }
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../../templates/module/frontend/router/router-template.js")
					,{encoding:'utf-8'}));
		fs.writeFileSync(file, template(data), 'utf-8');	
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");			
	},
	buildFrontendMain:function(){
		var file = path.join(this._config.options.output,"ui","modules",this._config.name,"main.js");
		if(fs.existsSync(file) && !fm.isAllowedOverride(file)  && this._config.options.override==false) return this;
		var template = _.template(fs.readFileSync(
					path.resolve(__dirname,"../../../templates/module/frontend/main-template.js")
					,{encoding:'utf-8'}));
		fs.writeFileSync(file, template(), 'utf-8');
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");			
	}
}