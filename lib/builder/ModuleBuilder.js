'use strict';
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
		require('./module/ModelBuilder').buildBackendModel.apply(this);
	},
	_buildAppFronted:function(){
		require('./module/ModelBuilder').buildFrontendModel.apply(this);
	}	
}