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
		}{% if(ACTIONS.length>0){ %},{% } %}
		{% for(var i=0;i<ACTIONS.length;i++){ var ACTION = ACTIONS[i]; %}
		//Auto generated function
		{{ACTION}}: function(){

		}{% if(i<(ACTIONS.length-1)){ %},{% } %}
		{% } %}
	});
});