'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	requirejs = require('requirejs');;

module.exports={
	modifyLocale:function(){
		//load existing locale file
		var self = this;
		var file = path.join(this._config.output,"ui","nls","locale.js");
		requirejs([file],function(localeObj){
			
			for(var i=0; i<self._config.views.length; i++){
				var viewConfig = self._config.views[i];
				if(!localeObj.root.hasOwnProperty(self._config.name)) localeObj.root[self._config.name]={};
				if(!localeObj.root[self._config.name].hasOwnProperty(viewConfig.name)) localeObj.root[self._config.name][viewConfig.name]={};
				var node = localeObj.root[self._config.name][viewConfig.name];
				//put more values here
				node.viewTitle 			=	node.viewTitle ? node.viewTitle : viewConfig.displayName;
				node.viewDescription 	=	node.viewDescription ? node.viewDescription : viewConfig.description;
				
			}

			var data = {
				"DEFAULT_LOCALE":JSON.stringify( localeObj,null,"  " )
			}
			if(fs.existsSync(file) && self._config.override==false) return;
			var template = _.template(fs.readFileSync(
							path.resolve(__dirname,"../../../templates/application/ui/nls/locale-template.js")
							,{encoding:'utf-8'}));
			fs.writeFileSync(file, template(data), 'utf-8');
			console.log(JSON.stringify( localeObj,null,"  " ));
		});
		return this;
	}
}