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
		if(!fs.existsSync(path.dirname(this._config.generate) )){			
			fs.mkdirSync(path.dirname(this._config.generate));
		}		
		switch(this._config.type){
			case "app":
				require('./module/MetadataBuilder').buildAppMetadata.apply(this);
				break;
			case "module":
				require('./module/MetadataBuilder').buildModuleMetadata.apply(this);
				break;
		}		
		return this;
	}
}