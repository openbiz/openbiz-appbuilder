"use strict";
define(['./@@MODEL_NAME@@'],function(Model){
	return Backbone.Collection.extend({
		model: Model,
		url: openbiz.apps.@@APP_NAME@@.appUrl+'@@MODEL_RESOURCE_URI@@'
	});
});