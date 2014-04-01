/**
 * Openbiz App Module Frontend Model File
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 */
"use strict";
define(['./{{MODEL_NAME}}'],function(Model){
	return Backbone.PageableCollection.extend({
		model: Model,
		url: openbiz.apps.{{APP_NAME}}.appUrl+'{{MODEL_RESOURCE_URI}}',
		state: {
			pageSize: 10,
			sortKey: "_id",
			order: 1
		}{% if(FUNCTIONS.length>0){ %},{% } %}
		{% for(var i=0;i<FUNCTIONS.length;i++){ var FUNCTION = FUNCTIONS[i]; %}
		//Auto generated function
		{{FUNCTION.name}}: function({{FUNCTION.parameters}}){
			{{FUNCTION.function}}
		}{% if(i<(FUNCTIONS.length-1)){ %},{% } %}
		{% } %}
	});
});