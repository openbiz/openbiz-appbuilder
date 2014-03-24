'use strict';
module.exports = function(app){	{% if (BASE_CONTROLLER=='ModelController' || BASE_CONTROLLER=='ModelSubdocController'  ){ %}	
	var name = require('path').basename(module.filename,'.js');
	return app.openbiz.{{BASE_CONTROLLER}}(app,name).extend({		
		_model: "{{MODEL_NAME}}",
		{% if (BASE_CONTROLLER=='ModelSubdocController'){ %}_path: "{{MODEL_PATH}}",{% } %}
		//trigger method for data collection get
		//The fetched record is at req.record
		beforeGetItem: function(req, res){},
		afterGetItem: function(req, res){},

		//trigger method for data collection fetch
		//The fetched records is at req.recordCollection
		beforeGetCollection: function(req, res){},
		afterGetCollection: function(req, res){},	

		//trigger method for data create
		//The created record is at req.record
		beforeCreate: function(req, res){},
		afterCreate: function(req, res){},

		//trigger method for data update
		//The old record is at req.record
		//The new record is at req.recordNew
		beforeUpdate: function(req, res){},
		afterUpdate: function(req, res){},
		

		//trigger method for data delete
		//The old record is at req.record
		beforeDelete: function(req, res){},
		afterDelete: function(req, res){}{% if(FUNCTIONS.length>0){ %},{% } %}
{% }else{ %}	return app.openbiz.Controller.extend({   {% } %}
{% for(var i=0;i<FUNCTIONS.length;i++){ var FUNCTION = FUNCTIONS[i]; %}
		//Auto generated function
		{{FUNCTION.name}}: function(req,res){ {{FUNCTION.function}} }{% if(i<(FUNCTIONS.length-1)){ %},{% } %}
{% } %}
	});
}