/**
 * Openbiz App Module Frontend Main Package File
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 */
"use strict";
define(['./router'],
	function(router){
        return openbiz.Module.extend({
		router: router
	});
});