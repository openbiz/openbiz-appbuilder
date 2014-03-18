'use strict';
module.exports = function(app){	{% if (BASE_CONTROLLER=='ModelController'){ %}	
	var name = require('path').basename(module.filename,'.js');
	return app.openbiz.ModelController(app,name).extend({		
		_model: "{{MODEL_NAME}}",
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
		afterDelete: function(req, res){}{% if(ACTIONS.length>0){ %},{% } %}
{% }else{ %}	return app.openbiz.Controller.extend({   {% } %}
{% for(var i=0;i<ACTIONS.length;i++){ var ACTION = ACTIONS[i]; %}
		//Auto generated function
		{{ACTION}}: function(req,res){}{% if(i<(ACTIONS.length-1)){ %},{% } %}
{% } %}
	});
}