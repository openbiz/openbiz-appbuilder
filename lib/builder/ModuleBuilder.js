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
		if(!fs.existsSync(path.join(this._config.options.output,"app","modules",this._config.name))){
			fs.mkdirSync(path.join(this._config.options.output,"app","modules",this._config.name));
		}	
		if(!fs.existsSync(path.join(this._config.options.output,"ui","modules",this._config.name))){
			fs.mkdirSync(path.join(this._config.options.output,"ui","modules",this._config.name));
		}

		this._buildAppBackend()
			._buildAppFronted();			
		return this;
	},
	_buildAppBackend:function(){
		if(this._config.options.verbose) console.log("Generate Module [ "+this._config.name+" ] Backend files");
		require('./module/ModelBuilder').buildBackendModel.apply(this);
		require('./module/ControllerBuilder').buildBackendController.apply(this);
		require('./module/RouterBuilder').buildBackendRouter.apply(this);
		require('./module/RoleBuilder').buildBackendRoles.apply(this);
		if(this._config.options.verbose) console.log(" ");
		return this;
	},
	_buildAppFronted:function(){
		if(this._config.options.verbose) console.log("Generate Module [ "+this._config.name+" ] Frontend files");
		require('./module/ModelBuilder').buildFrontendModel.apply(this);
		require('./module/RouterBuilder').buildFrontendMain.apply(this);
		require('./module/RouterBuilder').buildFrontendRouter.apply(this);
		require('./module/ViewBuilder').buildFrontendViews.apply(this);	
		require('./module/MenuBuilder').modifyFrontendMenu.apply(this);	
		require('./module/LocaleBuilder').modifyLocale.apply(this);
		require('./module/MainBuilder').modifyFrontendMain.apply(this);			
		if(this._config.options.verbose) console.log(" ");
		return this;
	}
}