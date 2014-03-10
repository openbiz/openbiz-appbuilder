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
		if(!fs.existsSync(path.join(this._config.output,"app","modules",this._config.name))){
			fs.mkdirSync(path.join(this._config.output,"app","modules",this._config.name));
		}	
		if(!fs.existsSync(path.join(this._config.output,"ui","modules",this._config.name))){
			fs.mkdirSync(path.join(this._config.output,"ui","modules",this._config.name));
		}	
		this._buildAppBackend()
			._buildAppFronted();
		return this;
	},
	_buildAppBackend:function(){
		require('./module/ModelBuilder').buildBackendModel.apply(this);
		require('./module/ControllerBuilder').buildBackendController.apply(this);
		require('./module/RouterBuilder').buildBackendRouter.apply(this);
		return this;
	},
	_buildAppFronted:function(){
		require('./module/ModelBuilder').buildFrontendModel.apply(this);
		return this;
	}	
}