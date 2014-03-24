"use strict";
define(['./{{MODEL_NAME}}'],function(Model){
	return Backbone.PageableCollection.extend({
		model: Model,
		url: openbiz.apps.{{APP_NAME}}.appUrl+'{{MODEL_RESOURCE_URI}}',
		state: {
			pageSize: 10,
			sortKey: "_id",
			order: 1
		},
		parseState: function (resp, queryParams, state, options) {
			return {totalRecords: resp.count};
		},
		parseRecords: function (resp, options) {
			return resp.items;
		}{% if(FUNCTIONS.length>0){ %},{% } %}
		{% for(var i=0;i<FUNCTIONS.length;i++){ var FUNCTION = FUNCTIONS[i]; %}
		//Auto generated function
		{{FUNCTION.name}}: function({{FUNCTION.parameters}}){
			{{FUNCTION.function}}
		}{% if(i<(FUNCTIONS.length-1)){ %},{% } %}
		{% } %}
	});
});