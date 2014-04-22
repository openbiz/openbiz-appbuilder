'use strict';

var fs = require("fs"),
	path = require("path"),
	_ = require('../../util/underscore'),
	fm = require('../../util/fileManager');

module.exports={
	buildFrontendLocale:function(){
		var localePath = path.join(this._config.options.output,'ui','nls');
		if(!fs.existsSync(localePath)){
			fs.mkdirSync(localePath);
		}

		var defaultLocale = {
		    'root': {
		        app:{
		            name:this._config.displayName,
		            description:this._config.description,
		            roles:{},
		            currencySymbol:"￥",
		        },
		        menu:{},
                "common":{
                    "deleteConfirmationTitle": "数据删除确认",
                    "deleteConfirmationMessage": "你即将删除这条数据:<h2><%= record %></h2> <br/> 是否确认此操作?",
                    "saveRecordTitle":"数据保存成功",
                    "saveRecordMessage":"数据已经提交到服务器并且保存成功！",
                    "saveRecordErrorTitle":"数据保存失败",
                    "saveRecordErrorMessage":"数据保存失败,请稍后再试！",
                    "deleteRecordErrorTitle":"数据删除失败",
                    "deleteRecordErrorMessage":"数据删除失败,请稍后再试！",
                    "noPermissionErrorMessage":"您没有权限进行此操作"
                },
		    }
		}

		for(var i=0;i<this._config.roles.length; i++)
		{
			defaultLocale.root.app.roles[this._config.roles[i].name]=this._config.roles[i].displayName;
		}

		for(var i=0;i<this._config.languages.length; i++)
		{
			var langName = this._config.languages[i];
			defaultLocale[langName]=true;
			var localeLangPath = path.join(this._config.options.output,'ui','nls',langName);
			if(!fs.existsSync(localeLangPath)){
				fs.mkdirSync(localeLangPath);
			}


			var data = {
				"DEFAULT_LOCALE" 	: JSON.stringify(defaultLocale.root,null,"  ")
			}

			var file = path.join(localeLangPath,"locale.js");
			if(fs.existsSync(file) && !fm.isAllowedOverride(file) && this._config.options.override==false){}else{
				var template = _.template(fs.readFileSync(
							path.resolve(__dirname,"../../../templates/application/ui/nls/locale-template.js")
							,{encoding:'utf-8'}));
				fs.writeFileSync(file, template(data), 'utf-8');
				if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
			}
		}

		var data = {
			"DEFAULT_LOCALE" 	: JSON.stringify(defaultLocale,null,"  ")
		}

		var file = path.join(localePath,"locale.js");
		var template;
		if(fs.existsSync(file) && !fm.isAllowedOverride(file) && this._config.options.override==false){}else{
			template = _.template(fs.readFileSync(
				path.resolve(__dirname,"../../../templates/application/ui/nls/locale-template.js")
				,{encoding:'utf-8'}));
            if(!fs.existsSync(file)){
			    fs.writeFileSync(file, template(data), 'utf-8');
			    if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
            }
		}
		if(fs.existsSync(file) && !fm.isAllowedOverride(file) && this._config.options.override==false) return this;
        if(!fs.existsSync(file)){
            fs.writeFileSync(file, template(data), 'utf-8');
		    if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... created");
        }
		return this;
	},
	modifyLocale:function(){
		//load existing locale file
		var file = path.join(this._config.options.output,"ui","nls","locale.js");
		var localeObj =  JSON.parse( (/\ndefine\(([\{\}\S\s]*)\)/g.exec(fs.readFileSync(file,'utf-8')))[1] );

		//process menu localization
		if(!localeObj.root.hasOwnProperty('menu')) localeObj.root.menu={};
		var node = localeObj.root.menu;
		node.title = node.title?node.title:this._config.app.displayName;
		for(var menuIndex=0;menuIndex<this._config.menus.length;menuIndex++){
			var menu = this._config.menus[menuIndex];
			var key = 'menu'+menu.name.charAt(0).toUpperCase() + menu.name.slice(1);
			if(menu.displayName) node[key] = node[key]?node[key]:menu.displayName;
		}

		//process breadcrumb node
		if(!localeObj.root.hasOwnProperty('breadcrumb')) localeObj.root.breadcrumb={};
		var node = localeObj.root.breadcrumb;
		node.home = node.home?node.home:'Home';
		node[this._config.app.name] = node[this._config.app.name]?node[this._config.app.name]:this._config.app.displayName;
		var breadcrumb = node;

		//process roles localization
        if(typeof this._config.roles == 'undefined'){}else{
            for(var i=0; i<this._config.roles.length; i++){
                var roleConfig = this._config.roles[i];
                if(!localeObj.root.hasOwnProperty('app'))localeObj.root.app={};
                if(!localeObj.root.app.hasOwnProperty('roles'))localeObj.root.app.roles={};
                var node = localeObj.root.app.roles;
                if(!node.hasOwnProperty(roleConfig.name)) node[roleConfig.name]=roleConfig.displayName;
            }
        }

		//process views localization
        if(typeof this._config.views == 'undefined'){}else{
            for(var i=0; i<this._config.views.length; i++){
                var viewConfig = this._config.views[i];
                if(!localeObj.root.hasOwnProperty(this._config.name)) localeObj.root[this._config.name]={};
                if(!localeObj.root[this._config.name].hasOwnProperty(viewConfig.name)) localeObj.root[this._config.name][viewConfig.name]={};
                var node = localeObj.root[this._config.name][viewConfig.name];
                //inject into breadcrumb
                breadcrumb[viewConfig.name] = breadcrumb[viewConfig.name]?breadcrumb[viewConfig.name]:viewConfig.displayName;

                //put more values here
                node.viewTitle 			=	node.viewTitle ? node.viewTitle : viewConfig.displayName;
                node.viewDescription 	=	node.viewDescription ? node.viewDescription : viewConfig.description;


                //process fields strings
                if(viewConfig.hasOwnProperty('fields')){
                    for(var fieldIndex=0;fieldIndex<viewConfig.fields.length;fieldIndex++){
                        var field = viewConfig.fields[fieldIndex];
                        var key = 'field'+field.name.charAt(0).toUpperCase() + field.name.slice(1);
                        if(field.displayName) node[key] = node[key]?node[key]:field.displayName;

                        var key = 'placeholder'+field.name.charAt(0).toUpperCase() + field.name.slice(1);
                        if(field.placeholder) node[key] = node[key]?node[key]:field.placeholder;

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
        }

		var data = {
			"DEFAULT_LOCALE":JSON.stringify( localeObj,null,"  " )
		}
		//if(fs.existsSync(file) && this._config.options.override==false) return;
		var template = _.template(fs.readFileSync(
						path.resolve(__dirname,"../../../templates/application/ui/nls/locale-template.js")
						,{encoding:'utf-8'}));
		fs.writeFileSync(file, template(data), 'utf-8');
		if(this._config.options.verbose) console.log("\tFile "+file.replace(path.dirname(this._config.options.output),"")+" ...... modified");

		return this;
	}
}