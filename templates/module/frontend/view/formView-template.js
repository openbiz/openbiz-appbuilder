"use strict";
define(['',''],
	function(templateData,dataModel){
		return openbiz.View.extend({
			app: 'xxx',
			module:'xx',
			name: 'xxx',
			el: '#main',
			apps:null,
			model:null,
			initialize:function(){
				openbiz.View.prototype.initialize.call(this);
				this.template = _.template(templateData);
				this.model = new dataModel();
			},
			renderDataGrid:function(){

			},
			render:function(){
				$(this.el).html(this.template(this.locale));
				$(window).off('resize');
				openbiz.ui.update($(this.el));
				return this;
			},
			saveRecord:function(event){
				event.preventDefault();
			},
			_validateForm:function(){
				return ;
			}
		});
	});