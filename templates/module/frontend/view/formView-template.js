/**
 * Openbiz App Module Frontend Form View File
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 */
"use strict";
define(['text!./{{VIEW_NAME}}.json',
	'text!templates/{{MODULE_NAME}}/{{VIEW_NAME}}.html',
	'../models/{{MODEL_NAME}}'
	/*CUSTOM_ELEMNT_CLASSES*/],
	function(metadata,templateData,dataModel){
		return openbiz.FormView.extend({
			app: '{{APP_NAME}}',
			module:'{{MODULE_NAME}}',
			name: '{{VIEW_NAME}}',
			el: '#main',
			model: dataModel,
			template: templateData,
			metadata: metadata,
			events:{},
			beforeRender:function(){},
			afterRender:function(){},{%if(VIEW_TYPE != 'addFormView' && VIEW_TYPE != 'addForm'){%}
			render:function(id){
				var self = this;
				this.model = new dataModel({_id:id});
				this.model.fetch({
					success:function(){
						openbiz.FormView.prototype.render.call(self);
					}
				});
			},{%}%}
			saveRecordSuccess:function(){},
			saveRecordError:function(){},
			beforeDeleteRecord:function(){},
			deleteRecordSuccess:function(){},
			deleteRecordError:function(){}{% if(FUNCTIONS.length>0){ %},{% } %}
		{% for(var i=0;i<FUNCTIONS.length;i++){ var FUNCTION = FUNCTIONS[i]; %}
			//Auto generated function
			{{FUNCTION.name}}: function({{FUNCTION.parameters}}){ {{FUNCTION.function}} }{% if(i<(FUNCTIONS.length-1)){ %},{% } %}{% } %}
	});
});