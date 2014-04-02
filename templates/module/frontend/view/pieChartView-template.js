/**
 * Openbiz App Module Frontend Form View File
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 */
"use strict";
define(['text!./{{VIEW_NAME}}.json',
	'text!templates/{{MODULE_NAME}}/{{VIEW_NAME}}.html'
	/*CUSTOM_ELEMNT_CLASSES*/],
	function(metadata,templateData,dataModel){
		return openbiz.charts.PieChartView.extend({
			app: '{{APP_NAME}}',
			name: '{{VIEW_NAME}}',
			module:'{{MODULE_NAME}}',
			el: '#main',
			template: templateData,
			metadata: metadata,
			events:{},
			beforeRender:function(){},
			afterRender:function(){},
			beforeDeleteRecord:function(){},
			afterDeleteRecord:function(){}{% if(FUNCTIONS.length>0){ %},{% } %}
		{% for(var i=0;i<FUNCTIONS.length;i++){ var FUNCTION = FUNCTIONS[i]; %}
			//Auto generated function
			{{FUNCTION.name}}: function({{FUNCTION.parameters}}){ {{FUNCTION.function}} }{% if(i<(FUNCTIONS.length-1)){ %},{% } %}{% } %}
	});
});