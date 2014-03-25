"use strict";
define(['text!./{{VIEW_NAME}}.json',
		'text!templates/{{MODULE_NAME}}/{{VIEW_NAME}}.html',
		'../models/{{MODEL_NAME}}'
		/*CUSTOM_ELEMNT_CLASSES*/],
	function(metadata,templateData,dataCollection){
	return openbiz.GridView.extend({
		app: '{{APP_NAME}}',
        module:'{{MODULE_NAME}}',
		name: '{{VIEW_NAME}}',
		el: '#main',
		collection: dataCollection,
		template: templateData,
		metadata: metadata,
		events:{},	
		elements:{ 
			//custom action elements 
		}, 	
		
		beforeRender:function(){},
		afterRender:function(){},

		beforeDeleteRecord:function(){},
		afterDeleteRecord:function(){}{% if(FUNCTIONS.length>0){ %},{% } %}
{% for(var i=0;i<FUNCTIONS.length;i++){ var FUNCTION = FUNCTIONS[i]; %}
		//Auto generated function
		{{FUNCTION.name}}: function(req,res){ {{FUNCTION.function}} }{% if(i<(FUNCTIONS.length-1)){ %},{% } %}
{% } %}
	});
});