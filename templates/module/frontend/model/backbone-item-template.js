"use strict";
define(function(){
	return Backbone.Model.extend({
		urlRoot:openbiz.apps.{{APP_NAME}}.appUrl+'{{MODEL_RESOURCE_URI}}',
		idAttribute: "_id",
		defaults:{}
	});
})