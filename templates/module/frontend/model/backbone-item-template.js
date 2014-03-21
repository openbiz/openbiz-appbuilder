"use strict";
define(function(){
	return Backbone.Model.extend({
		urlRoot:openbiz.apps.{{APP_NAME}}.appUrl+'{{MODEL_RESOURCE_URI}}',
		idAttribute: "_id",
		defaults:{}{% if(FUNCTIONS.length>0){ %},{% } %}
		{% for(var i=0;i<FUNCTIONS.length;i++){ var FUNCTION = FUNCTIONS[i]; %}
		//Auto generated function
		{{FUNCTION.name}}: function({{FUNCTION.parameters}}){
			{{FUNCTION.function}}
		}{% if(i<(FUNCTIONS.length-1)){ %},{% } %}
		{% } %}
	});
})