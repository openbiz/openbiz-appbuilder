/**
 * Openbiz App Module Frontend Form Element File
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 */
"use strict";
define([],function(){
	return openbiz.Element.extend({
		getConfig:function(obj,column){
			var field = openbiz.Element.getConfig.call(this,obj,column);
			field.cell = "string";// you can do whatever you want
//          eg
//			field.cell = openbiz.Grid.UriCell.extend({
//				render: function () {
//					this.$el.empty();
//					this.$el.append($("<a>", {
//						tabIndex: -1,
//						href: "#",
//						title: "This is my element"
//					}).text("This is my element"));
//					this.delegateEvents();
//					return this;
//				}
//			});
			return field;
		}
	});
});