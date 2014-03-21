"use strict";
define(function(){
	return Backbone.Model.extend({
		urlRoot:openbiz.apps.{{APP_NAME}}.appUrl+'{{MODEL_RESOURCE_URI}}',
		idAttribute: "_id",
		defaults:{}{% if(ACTIONS.length>0){ %},{% } %}
		{% for(var i=0;i<ACTIONS.length;i++){ var ACTION = ACTIONS[i]; %}
		//Auto generated function
		{{ACTION.name}}: function({{ACTION.parameters}}){
			{{ACTION.function}}
		}{% if(i<(ACTIONS.length-1)){ %},{% } %}
		{% } %}
	});
})