'use strict';

var fs = require("fs"),
	path = require("path");

module.exports={
	buildBackendController:function(){
		for(var i =0 ; i<this._config.models.length; i++){			
			var modelConfig = this._config.models[i];

		}
		return this;
	}
}