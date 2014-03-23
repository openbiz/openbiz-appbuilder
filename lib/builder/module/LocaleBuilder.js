'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	requirejs = require('requirejs');;

module.exports={
	modifyLocale:function(){
		//load existing locale file
		var self = this;
		var file = path.join(this._config.options.output,"ui","nls","locale.js");
		requirejs([file],function(localeObj){
			
			//process roles localization
			for(var i=0; i<self._config.roles.length; i++){
				var roleConfig = self._config.roles[i];
				if(!localeObj.root.hasOwnProperty('app'))localeObj.root.app={};
				if(!localeObj.root.app.hasOwnProperty('roles'))localeObj.root.app.roles={};
				var node = localeObj.root.app.roles;
				if(!node.hasOwnProperty(roleConfig.name)) node[roleConfig.name]=roleConfig.displayName;
			}


			//process views localization
			for(var i=0; i<self._config.views.length; i++){
				var viewConfig = self._config.views[i];
				if(!localeObj.root.hasOwnProperty(self._config.name)) localeObj.root[self._config.name]={};
				if(!localeObj.root[self._config.name].hasOwnProperty(viewConfig.name)) localeObj.root[self._config.name][viewConfig.name]={};
				var node = localeObj.root[self._config.name][viewConfig.name];
				//put more values here
				node.viewTitle 			=	node.viewTitle ? node.viewTitle : viewConfig.displayName;
				node.viewDescription 	=	node.viewDescription ? node.viewDescription : viewConfig.description;
				

				//process fields strings
				if(viewConfig.hasOwnProperty('fields')){
					for(var fieldIndex=0;fieldIndex<viewConfig.fields.length;fieldIndex++){
						var field = viewConfig.fields[fieldIndex];
						var key = 'field'+field.name.charAt(0).toUpperCase() + field.name.slice(1);
						if(field.displayName) node[key] = node[key]?node[key]:field.displayName;
					}
				}

				//process actions strings
				if(viewConfig.hasOwnProperty('actions')){
					for(var actionIndex=0;actionIndex<viewConfig.actions.length;actionIndex++){
						var item = viewConfig.actions[actionIndex];
						var key = 'action'+item.name.charAt(0).toUpperCase() + item.name.slice(1);
						if(item.displayName) node[key] = node[key]?node[key]:item.displayName;
					}
				}

				//process recordActions strings
				if(viewConfig.hasOwnProperty('recordActions')){
					for(var actionIndex=0;actionIndex<viewConfig.recordActions.length;actionIndex++){
						var item = viewConfig.recordActions[actionIndex];
						var key = 'recordAction'+item.name.charAt(0).toUpperCase() + item.name.slice(1);
						if(item.displayName) node[key] = node[key]?node[key]:item.displayName;
					}
				}
			}

			var data = {
				"DEFAULT_LOCALE":JSON.stringify( localeObj,null,"  " )
			}
			if(fs.existsSync(file) && self._config.options.override==false) return;
			var template = _.template(fs.readFileSync(
							path.resolve(__dirname,"../../../templates/application/ui/nls/locale-template.js")
							,{encoding:'utf-8'}));
			fs.writeFileSync(file, template(data), 'utf-8');
		});
		return this;
	}
}